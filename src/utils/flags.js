// Mapa nombre de selección → código de bandera (flagcdn.com, gratis sin API key).
const NAME_TO_CODE = {
  Argentina: "ar", Brazil: "br", France: "fr", Germany: "de", Spain: "es",
  Italy: "it", Mexico: "mx", "South Africa": "za", "South Korea": "kr",
  "North Korea": "kp", "Czech Republic": "cz", Portugal: "pt", Netherlands: "nl",
  Belgium: "be", Croatia: "hr", Uruguay: "uy", Colombia: "co", Japan: "jp",
  USA: "us", "United States": "us", Canada: "ca", Morocco: "ma", Senegal: "sn",
  Ghana: "gh", Nigeria: "ng", Cameroon: "cm", Switzerland: "ch", Denmark: "dk",
  Poland: "pl", Sweden: "se", Serbia: "rs", Qatar: "qa", "Saudi Arabia": "sa",
  Iran: "ir", Australia: "au", Ecuador: "ec", Peru: "pe", Chile: "cl",
  Paraguay: "py", "Costa Rica": "cr", Tunisia: "tn", Algeria: "dz", Egypt: "eg",
  "Ivory Coast": "ci", Greece: "gr", Turkey: "tr", "Türkiye": "tr", Austria: "at",
  Norway: "no", Ukraine: "ua", Panama: "pa", Honduras: "hn", Jamaica: "jm",
  Venezuela: "ve", Bolivia: "bo", "New Zealand": "nz", Uzbekistan: "uz",
  Jordan: "jo", Iraq: "iq", "Cape Verde": "cv", Curaçao: "cw", Haiti: "ht",
  "Democratic Republic of the Congo": "cd", "DR Congo": "cd",
  England: "gb-eng", Scotland: "gb-sct", Wales: "gb-wls",
  "Bosnia and Herzegovina": "ba",
};

export function teamCode(name) {
  return name ? NAME_TO_CODE[name] || null : null;
}

export function teamFlagUrl(name, width = 80) {
  const code = teamCode(name);
  return code ? `https://flagcdn.com/w${width}/${code}.png` : null;
}
