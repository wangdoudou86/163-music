window.eventHub = {
    events: {
        //青年报:[fn],
        //都市报:[fn]
    }, // hash
    emit(eventName, data) { //发布  抓捕行动中一旦有任何动静就报告，并传具体动作
        for (let key in this.events) {
            if (key === eventName) {
                let fnList = this.events[key]
                fnList.map((fn) => {
                    fn.call(undefined, data)
                })
            }
        }
    },
    on(eventName, fn) { //订阅  根据动静作出相应的抓捕行动
        if (this.events[eventName] === undefined) {
            this.events[eventName] = []
        }
        this.events[eventName].push(fn)
    }
}