/**
 * Created by daisy on 15/10/11.
 */

const  MAIN_BG_TAG = 12345;
var WheelSurfLayer = cc.Layer.extend({
    mainBg:null,
    vecPoint:null,
    originalPoint:null,
    wheelEmpty:null,
    targetPoint:null,
    startBtn:null,
    chooseNum:0,
    lastNum: 0,
    totalNum:14,
    isEnabledClicked:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;
        this.isEnabledClicked = true;

        this.mainBg = new cc.Sprite(res.MainBackground_png);
        this.mainBg.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(this.mainBg, 0, MAIN_BG_TAG);

        var titleBg = new cc.Sprite(res.TitleBackground_png);
        titleBg.attr({
            x: size.width / 2 - 240,
            y: size.height / 2 + 200
        });
        titleBg.setScale(0.6);
        this.addChild(titleBg, 2);

        var lotteryLabel = new cc.LabelTTF("抽奖", "Arial", 25);
        // position the label on the center of the screen
        lotteryLabel.x = size.width / 2 - 240;
        lotteryLabel.y = size.height / 2 + 210;
        // add the label as a child to this layer
        this.addChild(lotteryLabel, 3);

        var wheelBg = new cc.Sprite(res.WheelBackground_png);
        wheelBg.attr({
           x:size.width / 2,
           y:size.height / 2
        });
        this.addChild(wheelBg, 1);

        this.wheelEmpty = new cc.Sprite(res.WheelEmpty_png);
        this.wheelEmpty.attr({
            x:size.width / 2,
            y:size.height / 2
        });
        this.addChild(this.wheelEmpty, 1);

        var startBg = new cc.Sprite(res.StartBackground_png);
        startBg.attr({
            x:size.width / 2,
            y:size.height / 2
        });
        this.addChild(startBg, 1);

        // add start button
        this.startBtn = new cc.MenuItemImage(
            res.StartLottery_png,
            res.StartLottery_png,
            this.onStartCallback, this);
        this.startBtn.setScale(0.7);

        var menu = new cc.Menu(this.startBtn);
        menu.x = size.width / 2;
        menu.y = size.height / 2;
        this.addChild(menu, 6);

        this.originalPoint = new cc.LayerColor(cc.color("#000000"));
        this.originalPoint.setContentSize(cc.size(0.00001,0.00001));
        this.originalPoint.setPosition(cc.p(this.wheelEmpty.getContentSize().width/2.0, this.wheelEmpty.getContentSize().height/2.0));
        this.wheelEmpty.addChild(this.originalPoint, 7);

        this.initPos(184);











        return true;
    },

    initPos:function(radius) {

        vecPos = new Array();

        for(var i = this.totalNum; i < this.totalNum * 2; i++)
        {
            var radians = cc.degreesToRadians(360/this.totalNum*(i));
            vecPos.push(cc.p(radius*Math.sin(radians),radius*Math.cos(radians)))
        }
        for(var i = this.totalNum; i < this.totalNum * 2; i++)
        {
            vecPos[i] = vecPos[i - this.totalNum];
        }

        for (var i=0;i<this.totalNum;i++)
        {
            var frame = new cc.Sprite(res.ItemBackground_png);
            frame.setPosition(vecPos[i]);
            this.originalPoint.addChild(frame, 7);
        }
        this.targetPoint = new cc.Sprite(res.ItemChoose_png);
        this.targetPoint.setPosition(vecPos[0]);
        this.originalPoint.addChild(this.targetPoint, 7);

        var vecName = ["李播", "苏晓超","王振璜","王必杰", "李志艺", "游月传", "陈燕淑", "孟丹丹", "陈峰", "黄艳丽","李协成","张煜轩","陈圆圆", "刘妍"];

        for(var i = 0; i < this.totalNum; i++)
        {
            var item = new cc.LabelTTF(vecName[i], "Arial", 25);
            item.setPosition(vecPos[i]);
            item.setScale(0.7);
            this.originalPoint.addChild(item,7,i+100);
        }


    },
    setFramePosition:function(sender, index){
        if (index >= 0 )
        {
            this.targetPoint.setPosition(vecPos[index]);
        }
    },
    getBaseSequenceActionWithcircleId:function(index, total){

        var delayTime = 0.1;
        var actionArray = new Array();
        for (var i = index;i < index + total; i++)
        {
            var num = i > this.totalNum ? i - this.totalNum :i;
            cc.log("num" + num);
            actionArray.push(cc.delayTime(delayTime));
            actionArray.push(cc.callFunc(this.setFramePosition,this,num));
        }
        var rotateSequence1 = cc.sequence(actionArray);
        return rotateSequence1;

    },
    getPlayCheckedEffectAction:function(index){

    },
    onStartCallback:function(sender){
        if(this.isEnabledClicked)
        {
            this.lastNum = this.lastNum + this.chooseNum;
            this.lastNum = this.lastNum > this.totalNum ?this.lastNum -  this.totalNum :this.lastNum;
            this.isEnabledClicked = false;
            var num = Math.random()* this.totalNum + 1;
            this.chooseNum = parseInt(num, 10);
            cc.log("chooseNum" + this.chooseNum);
            var callback = cc.callFunc(this.onEndCallback, this);
            var rotateSequence = cc.sequence(
                this.getBaseSequenceActionWithcircleId(this.lastNum,this.totalNum),
                this.getBaseSequenceActionWithcircleId(this.lastNum,this.totalNum),
                this.getBaseSequenceActionWithcircleId(this.lastNum,this.totalNum),
                this.getBaseSequenceActionWithcircleId(this.lastNum,this.totalNum),
                this.getBaseSequenceActionWithcircleId(this.lastNum,this.totalNum),
                this.getBaseSequenceActionWithcircleId(this.lastNum,this.chooseNum),
                callback
            );

            rotateSequence.clone().easing(cc.easeOut(2.0));
            // var easeOut = cc.easeOut(rotateSequence,2);
            //easeOut.setTag(1111);
            this.targetPoint.runAction(rotateSequence);
        }




    },
    onEndCallback:function(sender){
        this.isEnabledClicked = true;
    }

});


var WheelSurfScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new WheelSurfLayer();
        this.addChild(layer);
    }
});