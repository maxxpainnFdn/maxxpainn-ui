

export default class EventBus {

    static emit(event: string, data: Record<string, any> = {}){
        document.dispatchEvent(new CustomEvent(event, { detail: data, bubbles: false }));
    }

    static on(event, callback=((data: any)=>{})) {
        document.addEventListener(event, (e) => {
            //console.log(e)
            callback(e?.detail)
        });
    }

    static off(event, callback = null) {
        document.removeEventListener(event, callback);
    }
}
