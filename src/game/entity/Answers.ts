class Answers {
    public btns: eui.Button[];
    private answerOption: string[];
    private correctAnswerIndex: number;
    private answerGroup: eui.Group;
    private selectImg: egret.Bitmap;
    private mapOption = { 0: 'A', 1: 'B', 2: 'C', 3: 'D' };
    private correctCallback: (cb: ()=>void)=>void;
    private currentQuestionScore: number;
    private defaultScore: number;
    constructor(defaultScore = 3) {
        this.defaultScore = this.currentQuestionScore = defaultScore; 
        this.btns = [];
        this.answerGroup = new eui.Group();
    }

    public initView() {
        // 绘制矩形用于显示 myGroup 的轮廓
        var outline:egret.Shape = new egret.Shape;
        outline.graphics.beginFill(0x1122cc,0);
        outline.graphics.drawRect(0, 0, 500, 300);
        outline.graphics.endFill();
        this.answerGroup.addChild(outline);
        //在 answerGroup 中创建4个按钮
        for (var i:number = 0; i < 4; i++) {
            var btn:eui.Button = new eui.Button();
            btn.label = this.mapOption[i];
            btn.x = (this.answerGroup.width - btn.width) / 2;
            btn.y = 11 + i * 30;
            this.answerGroup.addChild(btn);
            this.btns.push(btn);
        }
        //使用绝对布局，会忽略 myGroup 中按钮的自定义坐标
        var layout = new eui.VerticalLayout();
        layout.gap = 30;
        layout.verticalAlign = egret.VerticalAlign.MIDDLE;
        layout.horizontalAlign = egret.HorizontalAlign.CENTER;
        this.answerGroup.layout = layout;
        this.initClick();
        return this.answerGroup;
    }

    public setQuestion(ques: Question) {
        this.currentQuestionScore = this.defaultScore;
        this.correctAnswerIndex = ques.answer - 1;
        this.answerOption = ques.options;
        this.btns.forEach((btn, i) => {
            btn.label = `${this.mapOption[i]}.${ques.options[i]}`;
        });
    }

    // 清除 对勾或叉号 img显示
    public clearSelectImg() {
        if (this.selectImg) this.answerGroup.removeChild(this.selectImg);
        this.selectImg = null;
    }

    // 开启或禁用按钮
    public switchBtns(open: boolean) {
        this.btns.forEach((btn) => btn.enabled = open);
    }

    // 设置按钮答对回调
    public setBtnCorrectCallBack(cb: ()=>void) {
        this.correctCallback = cb;
    }

    // 初始化点击事件监听
    private initClick(){
        const self = this;
        // 图片资源
        const errorImg = GameUtils.createBitmapByName('error_png');
        const correctImg = GameUtils.createBitmapByName('correct_png');
        // 声音资源
        const errorSound: egret.Sound = RES.getRes('select_mp3')
        const correctSound: egret.Sound = RES.getRes('gameover_mp3');
        this.btns.forEach((btn, i) => {
            GameUtils.btnToListener(btn, () => {
                self.clearSelectImg.call(self);
                self.selectImg = i === self.correctAnswerIndex ? correctSound.play(0,1) && correctImg : errorSound.play(0,1) && errorImg;
                self.selectImg.width = btn.height - 1;
                self.selectImg.height = btn.height - 1;
                self.selectImg.x = btn.x - self.selectImg.width - 10;
                self.selectImg.y = btn.y - 1;
                self.answerGroup.addChild(self.selectImg);
                if (i !== self.correctAnswerIndex) {
                    return self.currentQuestionScore--;
                }
                self.switchBtns.call(self, false);
                SceneController.user.currentLevelScore += self.currentQuestionScore;
                SceneController.user.totalScore += self.currentQuestionScore;
                setTimeout(() => {
                    self.correctCallback(() => self.switchBtns.call(self, true));
                }, 1000);
            });
        });
    }
}