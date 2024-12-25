function Divider() {
    return (
        <>
            <div className="divider">
                <span className="divider-text">OR</span>
            </div>
            <style>{`
/* 分割线容器 */
.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 18px 0; /* 上下间距 */
  position: relative;
}

/* 左右线条 */
.divider::before,
.divider::after {
  content: "";
  flex-grow: 1; /* 填充剩余空间 */
  height: 1.5px; /* 线条高度 */
  background-color: #E4E4E7; /* 浅灰色线条 */
}

/* 中间文字 */
.divider-text {
  color: #000; /* 黑色文本 */
  font-size: 14px; /* 字体大小 */
  font-weight: 500; /* 加粗 */
  background-color: #fff; /* 背景颜色，覆盖线条 */
  padding: 0 16px; /* 内边距，增加左右空间 */
}

            `}</style>
        </>
    );
}

export default Divider;
