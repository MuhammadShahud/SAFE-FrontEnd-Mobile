import { extendTheme } from "native-base";

const theme = extendTheme({
  fontConfig: {
    TextaAlt: {
      100: {
        normal: 'TextaAltLight',
      },
      200: {
        normal: 'TextaAltRegular',
      },
      300: {
        normal: 'TextaAltRegular',
      },
      400: {
        normal: 'TextaAltMedium',
      },
      500: {
        normal: 'TextaAltMedium',
      },
      600: {
        normal: 'TextaAltBold',
      },
      700: {
        normal: 'TextaAltBold',
      },
      800: {
        normal: 'TextaAltHeavy',
      },
      900: {
        normal: 'TextaAltHeavy',
      },
    },
  },
  fontWeights: {
    light: 100,
    normal: 200,
    medium: 400,
    semibold: 600,
    bold: 800,
    extrabold: 900,
  },
  fonts: {
    heading: 'TextaAlt',
    body: 'TextaAlt',
    mono: 'TextaAlt',
  },
  fontSizes: {
    xs: 14,
  },
  components:{
    Input:{
      defaultProps: {
        variant: "outline"
    }
    }
  },
  colors: {
    primary: {
      50: "#AC9956",
      100: "#AC9956",
      200: "#AC9956",
      300: "#AC9956",
      400: "#AC9956",
      500: "#AC9956",
      600: "#AC9956",
      700: "#AC9956",
      800: "#AC9956",
      900: "#AC9956",
    }
  },
  config:{
    useSystemColorMode: false,
    initialColorMode:"light"
  }
});

export default theme;