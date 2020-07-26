/*
 * @Descripttion:
 * @file:
 * @module:
 * @version: 1.0.0
 * @Author: Ruhig Nieh
 * @Date: 2020-07-13 10:53:40
 * @LastEditors: Ruhig Nieh
 * @LastEditTime: 2020-07-13 10:54:57
 */

Component({
  mixins: [],
  data: {},
  props: {
    data: {},
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    onhandle() {
      const { data = {}, onFn } = this.props;
      if (data.disabled) {
        return;
      }
      onFn && onFn();
    },
  },
});
