function Divider() {
    return (
        <>
            <div className="divider">
                <span className="divider-text">OR</span>
            </div>
            <style>{`
.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 18px 0; 
  position: relative;
}

.divider::before,
.divider::after {
  content: "";
  flex-grow: 1; 
  height: 1.5px;
  background-color: var(--wallet-border-color);
}

.divider-text {
  color: var(--wallet-text-foreground-color); 
  font-size: 14px; 
  font-weight: 500; 
  padding: 0 16px;
}

            `}</style>
        </>
    );
}

export default Divider;
