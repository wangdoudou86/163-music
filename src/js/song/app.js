{   
    let view = {
        el:'.app',
        template:`
        <h2>{{name}}</h2>
        <audio src="{{url}}"></audio>
        <div>
           <button class="play">播放</button>
           <button class="pause">暂停</button>
        </div>
        `,
        render(data){
            $(this.el).html(this.template.replace('{{name}}',data.name).replace('{{url}}',data.url))
        },
        play(){
            let audio = $(this.el).find('audio')[0]
            audio.play()
        },
        pause(){
            let audio = $(this.el).find('audio')[0]
            audio.pause()
        },
    }
    let model = {
        data:{
            id:'',
            name:'',
            singer:'',
            url:''
        },
        getSong(id){
            var query = new AV.Query('Song');
            return query.get(id).then((song)=>{  //一定记得把它return出去
                Object.assign(this.data,{id:song.id,...song.attributes})
                return song
            }, (error)=>{
                alert('获取歌曲失败')
            });
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            let id = this.getSongId()
            this.model.getSong(id).then(()=>{
                this.view.render(this.model.data)
            })
            this.bindEvents()
        },
        bindEvents(){
            $(this.view.el).on('click','.play',()=>{
                this.view.play()
            })
            $(this.view.el).on('click','.pause',()=>{
                this.view.pause()
            })
        },
        getSongId(){
            let search = window.location.search
            if(search.indexOf('?') === 0){
                search = search.substring(1)
            }
            let id
            let array = search.split('&').filter((v=>v)) //filter((v=>v))过滤空字符串
            for(let i=0;i<array.length;i++){
                let kv = array[i].split('=')
                let key = kv[0]
                let value = kv[1]
                if(key === 'id'){
                    id = value
                }
                break
            }
            return id
        }
    }
    controller.init(view,model)
}