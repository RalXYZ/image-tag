module.exports = {
  plugins: [
    'gatsby-plugin-top-layout',
    'gatsby-plugin-react-helmet',
    // If you want to use styled components you should add the plugin here.
    // 'gatsby-plugin-styled-components',
    'gatsby-plugin-mui-emotion',
    'gatsby-plugin-layout',
  ],
  siteMetadata: {
    title: 'My page',
  },
  proxy: {
    prefix: "/api",
    url: "http://localhost:3000",
  },
};
