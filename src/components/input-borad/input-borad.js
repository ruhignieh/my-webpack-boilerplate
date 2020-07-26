import { promisoryMy } from "@/utils/utils";

Component({
  mixins: [],
  data: {
    SW: [],
    defaultHideErr: true,
    btn: {
      text: "选择默认推荐",
      size: "small",
    },
    activeFocus: false,
    typeSuccess: true,
    textErr: false,
    textLenErr: false,
    canSave: false,
    title: "", // 情话定制
    tips: "注：请输入英文大写，仅支持10个字符，不支持特殊符号",
    errTips: "注：您输入的内容包含敏感词，请重新输入",
    errLenTips: "注：请输入英文大写，仅支持10个字符，不支持特殊符号",
    value: "",
    show: false,
  },
  props: {
    max: 10,
    min: 1,
    showTipList: true,
    tipList: ["I LOVE YOU", "想到你就幸福地冒泡", "我的超能力是超级喜欢你"],
    isPassed: true,
    activeKeyboard: false,
    valiText: [],
    onFinishedInput: () => {},
    onHideKeyboard: () => {},
  },
  didUpdate(prevProps) {
    if (prevProps.activeKeyboard === true && !this.props.activeKeyboard) {
      this.onHideKeyboard();
    } else {
      this.onShowKeyBoard();
    }
  },
  async didMount() {
    const app = getApp();
    const params = {
      kind: "getSensitiveWords",
      data: {},
    };
    const data = await app.request.fetch(params);
    this.setData({
      SW: data.data,
      tips: `注：请输入英文大写，仅支持${this.props.max}个字符，不支持特殊符号`,
    });
  },
  didUnmount() {},
  methods: {
    closed() {
      this.setData({
        show: false,
      });
    },
    onFocus() {
      this.setData({
        activeFocus: true,
      });
    },
    onBlur() {
      this.setData({
        activeFocus: false,
      });
    },
    chooseText(e) {
      const {
        dataset: { text = "" },
      } = e.target;
      this.setData({
        value: text,
        show: false,
        canSave: true,
        textErr: false,
        textLenErr: false,
      });
      this.props.onHideKeyboard({
        text,
        legal: true,
      });
    },
    clear() {
      this.setData({
        value: "",
      });
    },
    bindKeyInput(e) {
      const { value = "" } = e.detail;
      const { max } = this.props;
      this.setData({
        value: value.toLocaleUpperCase().substring(0, max),
      });
      this.props.onFinishedInput(value);
    },
    validateTextSync(value = "") {
      const reg = /^[a-zA-Z0-9\s]+$/;
      value = value.trim();
      if (reg.test(value)) {
        this.setData({
          typeSuccess: true,
        });
      } else {
        this.setData({
          typeSuccess: false,
        });
      }
      if (value.length > this.props.max || value.length < this.props.min) {
        this.setData({
          textLenErr: true,
        });
        // return false;
      } else {
        this.setData({
          textLenErr: false,
        });
      }
      const passed = this.props.valiText.some((item) => ~value.indexOf(item));
      this.setData({
        textErr: passed,
      });
      // return !passed;
    },
    validateInput(val) {
      this.validateTextSync(val);
      const isPassed =
        !this.data.textLenErr && !this.data.textErr && this.data.typeSuccess;
      const textRiskIdentification = promisoryMy(my.tb.textRiskIdentification);
      return textRiskIdentification({
        data: {
          text: val,
        },
      })
        .then((res) => {
          if (res.data.result.checkPoints[0].suggestion === "block") {
            this.setData({
              canSave: false,
              textErr: true,
            });
          } else {
            this.setData({
              canSave: isPassed,
            });
          }
        })
        .catch(() => {
          this.setData({
            canSave: isPassed,
          });
        });
    },
    handleClick() {
      const { show = false } = this.data;
      this.setData({
        show: !show,
      });
    },
    onShowKeyBoard() {
      this.setData({
        activeFocus: true,
      });
    },
    onHideKeyboard() {
      this.setData({
        defaultHideErr: false,
        activeFocus: false,
      });
      const { value } = this.data;
      this.validateInput(value).then(() => {
        const { canSave } = this.data;
        console.log("cansave:", canSave);
        this.props.onHideKeyboard({
          text: value,
          legal: canSave,
        });
      });
    },
  },
});
