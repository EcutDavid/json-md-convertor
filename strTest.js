const str = `
---
user: benjamin
title: Benjamin Derville
position: Developer
featured: false
---
`
console.log(/user: ?\w*/.exec(str)[0]);
