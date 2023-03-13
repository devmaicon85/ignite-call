/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.tsx"],
    theme: {
        //   fontSize: {
        //       xs: 14,
        //       sm: 16,
        //       md: 18,
        //       lg: 20,
        //       xl: 24,
        //       "2xl": 32,
        //       "3xl": 40,
        //   },

        colors: {
            black: "#000000",
            white: "#FFFFFF",
            transparent: "transparent",
            gray: {
                100: "#E1E1E6",
                200: "#A9A9B2",
                400: "#7C7C8A",
                500: "#505059",
                600: "#323238",
                700: "#29292E",
                800: "#202024",
                900: "#121214",
            },

            cyan: {
                500: "#81d8f7",
                300: "#9be1fb",
            },
            red: {
                100: "#ffc5c7",
                200: "#f79a9d",
                300: "#f9333b",
                500: "#ec1c24",
                700: "#c2131a",
                900: "#800a0e",
            },
        },
        extend: {
            fontFamily: {
                sans: "Roboto, sans-serif",
            },
        },
    },
    plugins: [require("tailwindcss"), require("autoprefixer")],
};
