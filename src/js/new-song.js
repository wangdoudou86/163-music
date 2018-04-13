{
    let view = {
        el:'.newSong',
        template:`
        新建歌曲
        `,
        render(data){
            $(this.el).html(this.template)
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.active()
            window.eventHub.on('upload',()=>{
                
            })
            window.eventHub.on('select',(data)=>{
                this.deactive()
            })
            $(this.view.el).on('click',this.active.bind(this)) //重点记住后半句
        },
        active(){
            $(this.view.el).addClass('active')
            window.eventHub.emit('new')   //元素被点击时，执行active函数，同时触发new事件            
        },
        deactive(){
            $(this.view.el).removeClass('active')
        }
    }
    controller.init(view,model)
}

