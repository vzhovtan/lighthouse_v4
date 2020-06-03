let res = ["asr9k"]
console.log(res)
let temp = {platform: "asr9k-64bit", component: "sfp", release: "6.6"}
if (!res.includes(temp.platform)){
    res.push(temp.platform)
}
console.log(res)