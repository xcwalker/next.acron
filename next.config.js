/** @type {import('next').NextConfig} */
const removeImports = require('next-remove-imports')();


module.exports = removeImports({
  async rewrites() {
    return [
      {
        source: '/@:username/:path*',
        destination: '/user/@:username/:path*', // Matched parameters can be used in the destination
      },
      {
        source: '/$:treename/:path*',
        destination: '/tree/:treename/:path*', // Matched parameters can be used in the destination
      },
    ];
  },
})