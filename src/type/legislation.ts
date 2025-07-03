export type Legislation = {
  [uf: string]: {
    ICMS: {
      cfop_validos: string[];
      aliquota: number;
      base_calculo_minima: number;
    };
  };
};

export const legislationDB: Legislation = {
  AC: {
    ICMS: {
      cfop_validos: ["5100", "6100"],
      aliquota: 0.17,
      base_calculo_minima: 800,
    },
  },
  AL: {
    ICMS: {
      cfop_validos: ["5101", "6101"],
      aliquota: 0.18,
      base_calculo_minima: 900,
    },
  },
  AP: {
    ICMS: {
      cfop_validos: ["5102", "6102"],
      aliquota: 0.19,
      base_calculo_minima: 950,
    },
  },
  AM: {
    ICMS: {
      cfop_validos: ["5103", "6103"],
      aliquota: 0.2,
      base_calculo_minima: 1000,
    },
  },
  BA: {
    ICMS: {
      cfop_validos: ["5104", "6104"],
      aliquota: 0.18,
      base_calculo_minima: 1100,
    },
  },
  CE: {
    ICMS: {
      cfop_validos: ["5105", "6105"],
      aliquota: 0.17,
      base_calculo_minima: 950,
    },
  },
  DF: {
    ICMS: {
      cfop_validos: ["5106", "6106"],
      aliquota: 0.18,
      base_calculo_minima: 1200,
    },
  },
  ES: {
    ICMS: {
      cfop_validos: ["5107", "6107"],
      aliquota: 0.17,
      base_calculo_minima: 1000,
    },
  },
  GO: {
    ICMS: {
      cfop_validos: ["5108", "6108"],
      aliquota: 0.17,
      base_calculo_minima: 1050,
    },
  },
  MA: {
    ICMS: {
      cfop_validos: ["5109", "6109"],
      aliquota: 0.18,
      base_calculo_minima: 950,
    },
  },
  MT: {
    ICMS: {
      cfop_validos: ["5110", "6110"],
      aliquota: 0.17,
      base_calculo_minima: 900,
    },
  },
  MS: {
    ICMS: {
      cfop_validos: ["5111", "6111"],
      aliquota: 0.17,
      base_calculo_minima: 950,
    },
  },
  MG: {
    ICMS: {
      cfop_validos: ["5103", "6103"],
      aliquota: 0.12,
      base_calculo_minima: 900,
    },
  },
  PA: {
    ICMS: {
      cfop_validos: ["5112", "6112"],
      aliquota: 0.17,
      base_calculo_minima: 1000,
    },
  },
  PB: {
    ICMS: {
      cfop_validos: ["5113", "6113"],
      aliquota: 0.18,
      base_calculo_minima: 950,
    },
  },
  PR: {
    ICMS: {
      cfop_validos: ["5114", "6114"],
      aliquota: 0.18,
      base_calculo_minima: 1100,
    },
  },
  PE: {
    ICMS: {
      cfop_validos: ["5115", "6115"],
      aliquota: 0.18,
      base_calculo_minima: 1000,
    },
  },
  PI: {
    ICMS: {
      cfop_validos: ["5116", "6116"],
      aliquota: 0.18,
      base_calculo_minima: 900,
    },
  },
  RJ: {
    ICMS: {
      cfop_validos: ["5102", "6102"],
      aliquota: 0.2,
      base_calculo_minima: 1200,
    },
  },
  RN: {
    ICMS: {
      cfop_validos: ["5117", "6117"],
      aliquota: 0.18,
      base_calculo_minima: 950,
    },
  },
  RS: {
    ICMS: {
      cfop_validos: ["5118", "6118"],
      aliquota: 0.18,
      base_calculo_minima: 1100,
    },
  },
  RO: {
    ICMS: {
      cfop_validos: ["5119", "6119"],
      aliquota: 0.175,
      base_calculo_minima: 900,
    },
  },
  RR: {
    ICMS: {
      cfop_validos: ["5120", "6120"],
      aliquota: 0.17,
      base_calculo_minima: 850,
    },
  },
  SC: {
    ICMS: {
      cfop_validos: ["5121", "6121"],
      aliquota: 0.17,
      base_calculo_minima: 1000,
    },
  },
  SP: {
    ICMS: {
      cfop_validos: ["5101", "6101"],
      aliquota: 0.18,
      base_calculo_minima: 1000,
    },
  },
  SE: {
    ICMS: {
      cfop_validos: ["5122", "6122"],
      aliquota: 0.18,
      base_calculo_minima: 900,
    },
  },
  TO: {
    ICMS: {
      cfop_validos: ["5123", "6123"],
      aliquota: 0.18,
      base_calculo_minima: 950,
    },
  },
};
