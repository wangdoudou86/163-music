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
            let {songs,selectedSongId} = data          
            let liList = songs.map((song)=>{
                let $li = $('<li></li>').text(song.name).attr('song-id',song.id) 
                if(song.id === selectedSongId){
                    $li.addClass('active')
                }
                return $li
            })
            $el.find('ul').empty()
            liList.map((domLi)=>{
                $el.find('ul').append(domLi) 
            })
        },
        clearActive(){
            $(this.el).find('.active').removeClass('active')
        }

    }
    let model = {
        data:{
            songs:[],
            selectedSongId:undefined
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
                let songId = e.currentTarget.getAttribute('song-id')
                this.model.data.selectedSongId = songId
                this.view.render(this.model.data)

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
            window.eventHub.on('update',(song)=>{
                let songs = this.model.data.songs
                for(let i=0;i<songs.length;i++){
                    if(songs[i].id === song.id){
                        Object.assign(songs[i],song)
                    }
                }
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view,model)
}