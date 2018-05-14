{
    let view = {
        el: '.page > main',
        init() {
            this.$el = $(this.el)
        },
        template: `
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
            if(data.id){
                $(this.el).prepend('<h1>编辑歌曲</h1>')
            }else{
                $(this.el).prepend('<h1>新建歌曲</h1>')
            }
        },
        reset(){
            this.render()
        }
    }
    let model = {
        data:{name:'',singer:'',url:'',id:''},    
        create(data) { //保存新建的数据
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
        },
        update(data){ //保存更新后的数据
            var song = AV.Object.createWithoutData('Song', this.data.id)
            song.set('name', data.name)
            song.set('singer', data.singer)
            song.set('url', data.url)
            return song.save().then(()=>{               
                Object.assign(this.data,data)
                //把新的数据赋给this.model.data，这是更新的内容在列表上实时更新的关键一步       
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
            
            window.eventHub.on('select',(data)=>{ //这一步把所选择歌曲的信息展示在表单中
                this.model.data = data
                this.view.render(this.model.data)//这里不用this.model.data，下面的this.model.data.id也不会更新
            })
            window.eventHub.on('new', (data)=>{
                if(this.model.data.id){
                  this.model.data = {
                    name: '', url: '', id: '', singer: ''
                  }
                }else{
                  Object.assign(this.model.data, data)
                }
                this.view.render(this.model.data)
              })
        },
        save(){ 
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
        },
        update(){
            let needs = ['name', 'singer', 'url']
            let data = {}
            needs.map((string) => {
                data[string] = this.view.$el.find(`input[name="${string}"]`).val()
            })//把每个input里的值收集起来
            this.model.update(data)
            .then(()=>{
                window.eventHub.emit('update',JSON.parse(JSON.stringify(this.model.data)))
                //这里传的this.model.data是被点击的歌曲的信息，有id，新的data里没有id，但是this.model.update里已经把返回的数据更新了
            })
            
        },
        bindEvents(){
            this.view.$el.on('submit', 'form', (e) => { //事件委托，委托给form
                e.preventDefault()
                if(this.model.data.id){
                    this.update()
                }else{
                    this.save()                   
                }               
            })
        }
    }
    controller.init(view, model)
}