import Vue from 'vue'
import {
    Button,
    Message,
    MessageBox
} from 'element-ui'

Vue.use(Button)
Vue.use(Message)
Vue.use(MessageBox)

// Message组件不同于其它组件，要挂载到Vue的全局上
Vue.prototype.$message = Message;
// MessageBox需要挂载到Vue上
Vue.prototype.$confirm = MessageBox.confirm;