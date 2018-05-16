{
    let view = {
        el:'section.newSongs',
        init(){
            this.$el = $(this.el)
        },
        render(data){
            let {songs} = data // !!!songs是个数组，赋值加上{}
            songs.map((song)=>{
                let $li = $(`
                <li class="songList">
                <a href="${song.url}">
                <h3>${song.name}</h3>
                </a>               
                <div class="singer">${song.singer}</div>
                <a href="${song.url}">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-bofang"></use>
                </svg>
                </a>
                </li> 
                `)
                this.$el.find('ol.list').append($li)
            })
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
        init(){
            this.view = view
            this.view.init()
            this.model = model
            this.model.find().then(()=>{
                this.view.render(this.model.data)
            })
            this.bindEvents()
        },
        bindEvents(){

        }
    }
    controller.init(view,model)
}