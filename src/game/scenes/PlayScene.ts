class PlayScene extends BaseScene {
    // 关卡实例
    public level: Level;
    // 试题展示实例
    private quesField: egret.TextField;
    private answers: Answers;
    // 得分展示实例
    private scoreField: egret.TextField;
    // bgm实例
    private playSceneBGM: { play: (start?: number, loop?: number)=>void, stop: ()=>void };
    // 场景是否初始化完成
    private isInited: boolean = false;

    constructor() {
        super();
        this.playSceneBGM = GameUtils.loadBgm('bgm_mp3');
        this.level = new Level();
        this.answers = new Answers();
        this.quesField = new egret.TextField;
        this.scoreField = new egret.TextField;
    }

    protected init() {
        this.initView();
        this.isInited = true;
    }

    // 初始化当前场景
    private initView() {
        // 根容器的宽高
        const {stageWidth, stageHeight} = SceneController.rootContainer.stage;

        // 游戏页背景
        const playBg = GameUtils.createBitmapByName('bg2_jpg');
        this.addChild(playBg);
        playBg.width = stageWidth;
        playBg.height = stageHeight;

        // 返回首页按钮
        const homeBtn = GameUtils.createBitmapByName('back_png');
        this.addChild(homeBtn);
        homeBtn.width = 100;
        homeBtn.height = 50;
        homeBtn.x = 50;
        homeBtn.y = 50;
        GameUtils.bitmapToBtn(homeBtn, () => {
            this.backBtnListener.call(this);
        });

        // 积分显示背影
        const scoreMask = new egret.Shape();
        scoreMask.graphics.beginFill(0x000000, 0.5);
        scoreMask.graphics.drawRect(0, 0, 100, 40);
        scoreMask.graphics.endFill();
        scoreMask.x = stageWidth - scoreMask.width - 40;
        scoreMask.y = 45;
        this.addChild(scoreMask);
        // 积分显示内容
        const scoreField = this.scoreField;
        scoreField.width = scoreMask.width - 2;
        scoreField.height = scoreMask.height;
        scoreField.textAlign = egret.HorizontalAlign.CENTER;
        scoreField.verticalAlign = egret.VerticalAlign.MIDDLE;
        scoreField.x = scoreMask.x - 1;
        scoreField.y = scoreMask.y;
        scoreField.textColor = 0xFFD700;
        scoreField.size = 23;
        this.addChild(scoreField);
        // 积分图标
        const score = GameUtils.createBitmapByName('score_png');
        this.addChild(score);
        score.width = 49;
        score.height = 49;
        score.x = scoreMask.x - score.width + 7;
        score.y = scoreMask.y - 6;


        // 试题展示区域背景
        const quesMask = new egret.Shape();
        quesMask.graphics.drawRect(0, 0, stageWidth, 200);
        quesMask.graphics.endFill();
        quesMask.y = 220;
        this.addChild(quesMask);

        // 试题
        const quesField = this.quesField;
        this.addChild(quesField);
        quesField.width = stageWidth - 20;
        quesField.height = quesMask.height - 10;
        quesField.x = quesMask.x + 10;
        quesField.y = quesMask.y + 8;

        quesField.textColor = 0x000000;
        quesField.size = 25;
        quesField.lineSpacing = 10;
        quesField.type = egret.TextFieldType.DYNAMIC;
        quesField.textAlign = egret.HorizontalAlign.CENTER;
        quesField.verticalAlign = egret.VerticalAlign.MIDDLE;

        // 题目选项
        const answerGroup = this.answers.initView();
        this.addChild(answerGroup);
        answerGroup.width = 500;
        answerGroup.height = 300;
        answerGroup.x = (stageWidth - answerGroup.width) / 2;
        answerGroup.y = quesMask.y + quesMask.height + 50;
        const self = this;
        this.answers.setBtnCorrectCallBack(self.nextQuestionListener.bind(self));
    }

    // 展示试题
    private showQuestion() {
        const {index, question} = this.level.getNextQuestion();
        this.quesField.text = `${index + 1}. ${question.quiz}`;
        this.answers.setQuestion(question);
        this.scoreField.text = `${SceneController.user.totalScore}$`;
    }

    // 返回按钮监听
    private backBtnListener() {
        this.stepOut();
        SceneController.instance.showHomeScene.call(SceneController.instance);
    }

    // 下一题监听或首次获取问题
    private nextQuestionListener(cb?: ()=>void ) {
        if (!this.isInited) {
            return this.level.pullNextLevelQuestions().then()
            .then(this.showQuestion.bind(this))
            .catch(console.error);
        };

        cb();
        this.answers.clearSelectImg();
        if (!this.level.isFinishedCurrentLevel && this.isInited) {
            return this.showQuestion();
        }
        this.level.pullNextLevelQuestions().then()
            .then(this.showQuestion.bind(this))
            .catch(console.error);
    }

    // 进入PlaySence
    public stepIn() {
        // 拉取第一次数据
        this.nextQuestionListener(SceneController.instance.showPlayScene);
        // 打开背景音乐
        this.playSceneBGM.play(0, 0);
    }

    // 离开PlaySence
    public stepOut() {
        // 停止背景音乐
        this.playSceneBGM.stop();
        // 重置关卡
        this.level.reset();
    }
}