{
    let view = {
        el:'#songList-container',
        template:`
        <ul class="songlist">                
        </ul>
        `,
        render(data){
            let $el = $(this.el)
            $el.html(this.template)   
            let {songs} = data          
            let liList = songs.map((song)=>{
                return $('<li></li>').text(song.name).attr('song-id',song.id) 
            })
            $el.find('ul').empty()
            liList.map((domLi)=>{
                $el.find('ul').append(domLi) 
            })
        },
        activeItem(li){
            let $li = $(li)
            $li.addClass('active')
            .siblings('.active').removeClass('active') //注意选择器和类名的使用
        },
        clearActive(){
            $(this.el).find('.active').removeClass('active')
        }

    }
    let model = {
        data:{
            songs:[]
        },
        find(){
            var query = new AV.Query('Song')
            return query.find().then((songs)=>{
            this.data.songs = songs.map((song)=>{
                return {id:song.id,...song.attributes}
            })  
            // return songs  暂时加不加这句都没有影响
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.getAllSongs()
            this.bindEventHub()
            this.bindEvents()
        },
        getAllSongs(){
            return this.model.find().then(()=>{
                this.view.render(this.model.data)
            })
        },
        bindEvents(){
            $(this.view.el).on('click','li',(e)=>{
                this.view.activeItem(e.currentTarget)
                let songId = e.currentTarget.getAttribute('song-id')
                let data
                let songs = this.model.data.songs
                for(let i=0;i<songs.length;i++){
                    if(songs[i].id === songId){
                        data = songs[i]
                        break
                    }
                }
                let string = JSON.stringify(data)
                let object = JSON.parse(string) //深拷贝 
                window.eventHub.emit('select',object)
            })
        },
        bindEventHub(){
            window.eventHub.on('create',(songData)=>{
                this.model.data.songs.push(songData)
                this.view.render(this.model.data)
            })
            window.eventHub.on('new',()=>{
                this.view.clearActive()
            })
        }
    }
    controller.init(view,model)
}