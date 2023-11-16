export const data = {
  global: {
    useUTC: false,
  },
  lang: {
    decimalPoint: ",",
    thousandsSep: ".",
    noData: "Không có dữ liệu hiển thị",
  },
  credits: {
    enabled: false,
  },
  exporting: {
    enabled: false,
  },
  legend: {
    enabled: true,
    itemStyle: {
      fontSize: "14",
      fontWeight: "600",
      color: "#614c4c",
    },
  },
  chart: {
    type: "column",
    backgroundColor: "transparent",
  },
  title: null,
  tooltip: {
    style: {
      fontSize: "14",
      fontWeight: "500",
      color: "#614c4c",
    },
  },
  yAxis: {
    min: 0,
    title: {
      text: null,
    },
    labels: {
      enabled: true,
      style: {
        fontSize: "14",
        fontWeight: "500",
        color: "#614c4c",
      },
    },
    reversedStacks: false,
  },
  xAxis: {
    enabled: true,
    labels: {
      style: {
        fontSize: "14",
        fontWeight: "500",
        color: "#614c4c",
      },
    },
    categories: ["10/11", "13/11", "15/11", "16/11"],
  },
  plotOptions: {
    column: {
      stacking: "column",
      maxPointWidth: 50,
    },
  },
  series: [
    {
      data: [5, 6, 0, 0],
      color: "#ea9e70",
      name: "Niềng răng mắc cài sứ",
      borderWidth: 0,
    },
    {
      data: [0, 9, 0, 0],
      color: "#ce7d78",
      name: "Niềng răng trong suốt",
      borderWidth: 0,
    },
    {
      data: [0, 10, 0, 0],
      color: "#a48a9e",
      name: "Implant vài răng",
      borderWidth: 0,
    },
    {
      data: [4, 6, 1, 7],
      color: "#63b598",
      name: "Implant cả hàm",
      borderWidth: 0,
    },
  ],
  accessibility: {
    enabled: false,
  },
  noData: {
    style: {
      fontWeight: "bold",
      fontSize: "14px",
    },
  },
};
