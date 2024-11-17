import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elb from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import * as elb_targets from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets';
import * as wafv2 from 'aws-cdk-lib/aws-wafv2';  // WAFのインポート

interface WebApiStackProps extends StackProps {
  vpc: ec2.Vpc;
  prefix?: string;
  domainName: string;
}

export class WebApiStack extends Stack {
  public readonly apiUrl: string;

  constructor(scope: cdk.App, id: string, props: WebApiStackProps) {
    super(scope, id, props);

    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: props.domainName,
    });

    const siteDomain = props.prefix
      ? `${props.prefix}-api.${props.domainName}`
      : `api.${props.domainName}`;

    const apiServer = new ec2.Instance(this, 'ApiInstance', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc: props.vpc,
    });

    const securityGroup = new ec2.SecurityGroup(this, 'ApiSecurityGroup', {
      vpc: props.vpc,
    });

    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'Allow HTTPS');
    apiServer.addSecurityGroup(securityGroup);

    const loadBalancer = new elb.ApplicationLoadBalancer(this, 'ApiLoadBalancer', {
      vpc: props.vpc,
      internetFacing: true,
    });

    const listener = loadBalancer.addListener('HttpsListener', {
      port: 443,
    });

    const certificate = new certificatemanager.Certificate(this, 'ApiCertificate', {
      domainName: siteDomain,
      validation: certificatemanager.CertificateValidation.fromDns(hostedZone),
    });

    listener.addCertificates('ApiCertificate', [certificate]);

    // ターゲットグループを作成し、EC2 インスタンスを登録
    const targetGroup = listener.addTargets('ApiTargetGroup', {
      port: 80,
      targets: [
        new elb_targets.InstanceIdTarget(apiServer.instanceId),
      ],
    });

    // WAF WebACLを作成
    const webAcl = new wafv2.CfnWebACL(this, 'ApiWebAcl', {
      scope: 'REGIONAL',  // ALBのWAFはREGIONALスコープで設定
      defaultAction: { allow: {} },
      rules: [
        {
          name: 'AllowRule',
          priority: 0,
          visibilityConfig: {
            cloudWatchMetricsEnabled: true,
            metricName: "api-web-acl-metric",
            sampledRequestsEnabled: true,
          },
          action: { allow: {} },
          statement: {
            byteMatchStatement: {
              searchString: 'allow',
              fieldToMatch: {
                uriPath: {},
              },
              textTransformations: [
                { priority: 0, type: 'NONE' }
              ],
              positionalConstraint: 'CONTAINS',
            }
          }
        }
      ],
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        metricName: 'ApiWAFMetric',
        sampledRequestsEnabled: true,
      },
    });

    // WAF WebACLをALBに関連付け
    new wafv2.CfnWebACLAssociation(this, 'ApiWebAclAssociation', {
      resourceArn: loadBalancer.loadBalancerArn,
      webAclArn: webAcl.attrArn,
    });

    // Route 53 に A レコードを追加
    new route53.ARecord(this, 'ApiAliasRecord', {
      zone: hostedZone,
      recordName: siteDomain,
      target: route53.RecordTarget.fromAlias(new route53Targets.LoadBalancerTarget(loadBalancer)),
    });

    // 出力
    this.apiUrl = `https://${siteDomain}`;
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: this.apiUrl,
    });
  }
}
