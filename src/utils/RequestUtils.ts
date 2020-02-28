class Ajax {
    public static get(url: string, options = {}) {
        const request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        request.open(url,egret.HttpMethod.GET);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send();
        return new Promise((resolve, reject) => {
            request.addEventListener(egret.Event.COMPLETE, (event:egret.Event) => {
                const {response} = <egret.HttpRequest>event.currentTarget;
                resolve(JSON.parse(response));
            },this);
            request.addEventListener(egret.IOErrorEvent.IO_ERROR, reject,this);
        });
    }
}