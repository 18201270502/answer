abstract class BaseScene extends eui.UILayer {
    protected createChildren(): void {
        super.createChildren();
        this.init();
    }
    // 初始化场景
    protected abstract init(): void;
}