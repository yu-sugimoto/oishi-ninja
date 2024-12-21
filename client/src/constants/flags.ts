import jpnFlagUrl from "../assets/flags/jp.svg";
import chnFlagUrl from "../assets/flags/cn.svg";
import vnmFlagUrl from "../assets/flags/vn.png";
import nplFlagUrl from "../assets/flags/np.svg";
import korFlagUrl from "../assets/flags/kr.svg";
import idnFlagUrl from "../assets/flags/id.svg";
import twFlagUrl from "../assets/flags/taiwan.png";
import lkaFlagUrl from "../assets/flags/lk.svg";
import mmrFlagUrl from "../assets/flags/mm.svg";
import bgdFlagUrl from "../assets/flags/bd.svg";
import mngFlagUrl from "../assets/flags/mn.svg";

export const imgFlagByAvailableCountryCodes = Object.freeze({
  "JPN": jpnFlagUrl,
  "CHN": chnFlagUrl,
  "VNM": vnmFlagUrl,
  "NPL": nplFlagUrl,
  "KOR": korFlagUrl,
  "IDN": idnFlagUrl,
  "TWN": twFlagUrl,
  "LKA": lkaFlagUrl,
  "MMR": mmrFlagUrl,
  "BGD": bgdFlagUrl,
  "MNG": mngFlagUrl,
}
)

export type AvailableCountryCode = keyof typeof imgFlagByAvailableCountryCodes;

export const getFlagImageByAvailableCountryCodes = (countryCode: AvailableCountryCode): string => {
  return imgFlagByAvailableCountryCodes[countryCode];
};
