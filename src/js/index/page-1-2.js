{
    let view = {
        el:'section.newSongs',
        init(){
            this.$el = $(this.el)
        },
        template:`
            <li class="songList">
            <a href="./song.html?id={{song.id}}">
            <h3>{{song.name}}</h3>
            </a>               
            <div class="singer">{{song.singer}}</div>
            <a href="./song.html?id={{song.id}}">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-bofang"></use>
            </svg>
            </a>
            </li> 
        `,
        render(data={}){
            let {songs} = data // !!!songs是个数组，赋值加上{}
            songs.map((song)=>{
                let $li = $(this.template.replace('{{song.name}}',song.name || '')
                .replace('{{song.singer}}',song.singer || '')
                .replace(new RegExp('{{song.id}}','g'),song.id || '')) //利用正则替换所有的id
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