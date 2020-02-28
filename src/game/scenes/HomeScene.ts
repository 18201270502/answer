class HomeScene extends BaseScene {
    protected init() {
        this.initView();
    }

    private initView() {
        // 根容器的宽高
        const {stageWidth, stageHeight} = SceneController.rootContainer.stage;

        // 主页背景
        const homeBg = GameUtils.createBitmapByName('bg_jpg');
        this.addChild(homeBg);
        homeBg.width = stageWidth;
        homeBg.height = stageHeight;

        // 主页标题图片
        const title = GameUtils.createBitmapByName('title_jpeg');
        this.addChild(title);
        title.x = 130;
        title.y = 250;
        title.height = 150;
        title.width = 400
    

        // 开始游戏按钮
        const startGameBtn = GameUtils.createBitmapByName('btn_start_png');
        this.addChild(startGameBtn);
        startGameBtn.x = (stageWidth - startGameBtn.width) / 2;
        startGameBtn.y = stageHeight - 600;
        
        GameUtils.bitmapToBtn(startGameBtn, () => {
            SceneController.instance.showPlayScene();
        })
    }
}