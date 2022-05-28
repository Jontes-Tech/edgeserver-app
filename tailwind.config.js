module.exports = {
    darkMode: 'class',
    content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                black: {
                    900: '#000000',
                    800: '#111111',
                },

                accent: {
                    blue: {
                        normal: '#0A84FF',
                        alt: '#102841',
                    },
                },
            },
        },
    },
    plugins: [],
};
