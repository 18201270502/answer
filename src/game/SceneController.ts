class SceneController {
    public static user: User;
    // 根场景容器
    public static rootContainer: egret.DisplayObjectContainer;

    // 场景控制器单例
    private static sceneController: SceneController;
    public static get instance() {
        if (!this.sceneController) {
            this.sceneController = new SceneController();
        }
        return this.sceneController;
    }

    // 当前场景容器
    private stageContainer: egret.DisplayObjectContainer
    // 所有场景
    private homeScene: HomeScene;
    private playScene: PlayScene;

    constructor() {
        this.homeScene = new HomeScene();
        this.playScene = new PlayScene();
    }

    public setStage(stage: egret.DisplayObjectContainer) {
        this.stageContainer = stage;
    }
    public getStage() {
        return this.stageContainer;
    }

    public initScene() {
        SceneController.rootContainer.addChild(this.homeScene);
        this.stageContainer = this.homeScene;
    }

    public showHomeScene() {
        SceneController.rootContainer.removeChild(this.stageContainer);
        this.initScene();
    }

    public showPlayScene() {
        SceneController.rootContainer.removeChild(this.stageContainer);
        this.playScene.stepIn();
        this.stageContainer = this.playScene;
        SceneController.rootContainer.addChild(this.playScene);
    }
}