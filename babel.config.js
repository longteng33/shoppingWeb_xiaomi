const prodPlugins=[];//这是项目在发布阶段用的插件
if(process.env.NODE_ENV === 'production'){
  prodPlugins.push("transform-remove-console")
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  'plugins':[
    // "transform-remove-console",
    ...prodPlugins,
  ]
}
