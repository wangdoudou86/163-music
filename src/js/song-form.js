{
    let view = {
        el: '.page > main',
        init() {
            this.$el = $(this.el)
        },
        template: `
        <h1>新建歌曲</h1>
            <form class="form">
                <div class="row">
                    <label>
                        歌名
                    </label>
                    <input name="name" type="text" value="_name_">
                </div>
                <div class="row">
                    <label>
                        歌手
                    </label>
                    <input name="singer" type="text" value="_singer_">
                </div>
                <div class="row">
                    <label>
                        外链
                    </label>
                    <input name="url" type="text" value="_url_">
                </div>
                <div class="row actions">
                    <button type="submit">保存</button>
                </div>
            </form>
        `,
        render(data = {}) { //ES6新语法 如果没有传data或者data为undefined，默认data为空对象
            let placeholders = ['name', 'singer','url','id']
            let html = this.template
            placeholders.map((string) => {
                html = html.replace(`_${string}_`, data[string] || '')
                //这里千万不要忘了写赋值！！！
            })
            $(this.el).html(html) //把内容放进容器里
        },
        reset(){
            this.render()
        }
    }
    let model = {
        data:{name:'',singer:'',url:'',id:''},    
        create(data) {
            var Song = AV.Object.extend('Song');
            var song = new Song();
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url);
            return song.save().then( (newSong)=>{
                let{id,attributes} = newSong //let id = newSong.id  let attributes=newSong.attributes
                this.data = {id,...attributes}    //这里要用this代表model，就得用箭头函数         
            },  (error)=>{
                console.error('没有保存成功')
            })
        }  
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.bindEvents()
            this.view.render(this.model.data)
            window.eventHub.on('upload', (data) => {
                this.view.render(data)
            })
        },
        bindEvents(){
            this.view.$el.on('submit', 'form', (e) => { //事件委托，委托给form
                e.preventDefault()
                let needs = ['name', 'singer', 'url']
                let data = {}
                needs.map((string) => {
                    data[string] = this.view.$el.find(`input[name="${string}"]`).val()
                })//把每个input里的值收集起来

        
                this.model.create(data) //把data里的数据保存到leancloud
                .then(()=>{
                    this.view.reset()  //保存成功后清空表单                   
                    window.eventHub.emit('create', this.model.data)
                })
            })
        }
    }
    controller.init(view, model)
}