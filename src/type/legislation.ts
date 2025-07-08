export type Legislation = {
  [uf: string]: {
    ICMS: {
      cfop_validos: string[];
      aliquota: number;
      base_calculo_minima: number;
      mva?: number;
      permite_st?: boolean;
    };
  };
};

export const legislationDB: Legislation = {
  AC: {
    ICMS: {
      cfop_validos: ["5100", "6100"],
      aliquota: 0.17,
      base_calculo_minima: 800,
      mva: 40,
      permite_st: true,
    },
  },
  AL: {
    ICMS: {
      cfop_validos: ["5101", "6101"],
      aliquota: 0.18,
      base_calculo_minima: 900,
      mva: 35,
      permite_st: false,
    },
  },
  AP: {
    ICMS: {
      cfop_validos: ["5102", "6102"],
      aliquota: 0.19,
      base_calculo_minima: 950,
      mva: 30,
      permite_st: true,
    },
  },
  AM: {
    ICMS: {
      cfop_validos: ["5103", "6103"],
      aliquota: 0.2,
      base_calculo_minima: 1000,
      mva: 25,
      permite_st: false,
    },
  },
  BA: {
    ICMS: {
      cfop_validos: ["5104", "6104"],
      aliquota: 0.18,
      base_calculo_minima: 1100,
      mva: 20,
      permite_st: true,
    },
  },
  CE: {
    ICMS: {
      cfop_validos: ["5105", "6105"],
      aliquota: 0.17,
      base_calculo_minima: 950,
      mva: 15,
      permite_st: false,
    },
  },
  DF: {
    ICMS: {
      cfop_validos: ["5106", "6106"],
      aliquota: 0.18,
      base_calculo_minima: 1200,
      mva: 10,
      permite_st: true,
    },
  },
  ES: {
    ICMS: {
      cfop_validos: ["5107", "6107"],
      aliquota: 0.17,
      base_calculo_minima: 1000,
      mva: 5,
      permite_st: false,
    },
  },
  GO: {
    ICMS: {
      cfop_validos: ["5108", "6108"],
      aliquota: 0.17,
      base_calculo_minima: 1050,
      mva: 12,
      permite_st: true,
    },
  },
  MA: {
    ICMS: {
      cfop_validos: ["5109", "6109"],
      aliquota: 0.18,
      base_calculo_minima: 950,
      mva: 18,
      permite_st: false,
    },
  },
  MT: {
    ICMS: {
      cfop_validos: ["5110", "6110"],
      aliquota: 0.17,
      base_calculo_minima: 900,
      mva: 22,
      permite_st: true,
    },
  },
  MS: {
    ICMS: {
      cfop_validos: ["5111", "6111"],
      aliquota: 0.17,
      base_calculo_minima: 950,
      mva: 28,
      permite_st: false,
    },
  },
  MG: {
    ICMS: {
      cfop_validos: ["5103", "6103"],
      aliquota: 0.12,
      base_calculo_minima: 900,
      mva: 32,
      permite_st: true,
    },
  },
  PA: {
    ICMS: {
      cfop_validos: ["5112", "6112"],
      aliquota: 0.17,
      base_calculo_minima: 1000,
      mva: 38,
      permite_st: false,
    },
  },
  PB: {
    ICMS: {
      cfop_validos: ["5113", "6113"],
      aliquota: 0.18,
      base_calculo_minima: 950,
      mva: 44,
      permite_st: true,
    },
  },
  PR: {
    ICMS: {
      cfop_validos: ["5114", "6114"],
      aliquota: 0.18,
      base_calculo_minima: 1100,
      mva: 50,
      permite_st: false,
    },
  },
  PE: {
    ICMS: {
      cfop_validos: ["5115", "6115"],
      aliquota: 0.18,
      base_calculo_minima: 1000,
      mva: 55,
      permite_st: true,
    },
  },
  PI: {
    ICMS: {
      cfop_validos: ["5116", "6116"],
      aliquota: 0.18,
      base_calculo_minima: 900,
      mva: 60,
      permite_st: false,
    },
  },
  RJ: {
    ICMS: {
      cfop_validos: ["5102", "6102"],
      aliquota: 0.2,
      base_calculo_minima: 1200,
      mva: 65,
      permite_st: true,
    },
  },
  RN: {
    ICMS: {
      cfop_validos: ["5117", "6117"],
      aliquota: 0.18,
      base_calculo_minima: 950,
      mva: 70,
      permite_st: false,
    },
  },
  RS: {
    ICMS: {
      cfop_validos: ["5118", "6118"],
      aliquota: 0.18,
      base_calculo_minima: 1100,
      mva: 75,
      permite_st: true,
    },
  },
  RO: {
    ICMS: {
      cfop_validos: ["5119", "6119"],
      aliquota: 0.175,
      base_calculo_minima: 900,
      mva: 80,
      permite_st: false,
    },
  },
  RR: {
    ICMS: {
      cfop_validos: ["5120", "6120"],
      aliquota: 0.17,
      base_calculo_minima: 850,
      mva: 85,
      permite_st: true,
    },
  },
  SC: {
    ICMS: {
      cfop_validos: ["5121", "6121"],
      aliquota: 0.17,
      base_calculo_minima: 1000,
      mva: 90,
      permite_st: false,
    },
  },
  SP: {
    ICMS: {
      cfop_validos: ["5101", "6101"],
      aliquota: 0.18,
      base_calculo_minima: 1000,
      mva: 95,
      permite_st: true,
    },
  },
  SE: {
    ICMS: {
      cfop_validos: ["5122", "6122"],
      aliquota: 0.18,
      base_calculo_minima: 900,
      mva: 100,
      permite_st: false,
    },
  },
  TO: {
    ICMS: {
      cfop_validos: ["5123", "6123"],
      aliquota: 0.18,
      base_calculo_minima: 950,
      mva: 105,
      permite_st: true,
    },
  },
};
