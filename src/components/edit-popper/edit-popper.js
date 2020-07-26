Component({
  mixins: [],
  data: {},
  props: {
    show: {
      type: Boolean,
      value: false,
    },
    onClose: () => {},
    onBack: () => {},
    onCropper: () => {},
    onDelete: () => {},
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    handleClose() {
      this.props.onClose();
    },
    handleBack() {
      this.props.onBack();
    },
    handleCropper() {
      this.props.onCropper();
    },
    handleDel() {
      this.props.onDelete();
    },
  },
});
