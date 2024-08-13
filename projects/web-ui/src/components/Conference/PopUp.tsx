import { css } from "@emotion/react";
import { useEffect } from "react";
import { useEventBus } from "../../hooks/useEventBus";

const popUpBoxStyle = css`
    position: relative;
    top: 0;
    min-width: 200px;
    max-width: 40%;
    margin: 0 auto;
    margin-top: 0px;
    border-style: solid;
    border-width: 2px;
    border-radius: 5px;
    display: grid;
    grid-template-columns: 13% 87%;
    animation-duration: 2.5s;
    animation-iteration-count: 2;
    animation-direction: alternate;
`;
const checkButtonStyle = css`
        width: 80%;
        margin: 0 auto;
        height: 80%;
        border-radius: 12px;
        border-color : var(--nicegreen);
        border: solid 2px;
        text-align: center;
        font-weight: 100;
        font-size: 15px;
        transition: background-color 0.25s;
    `;
const stkCoverStyle = css`
        position: absolute;
        z-index: 11;
        height: 0;
        width: 0;
        background-color: #00000080;
    `;
const circle_radius = 7;
const cutter_min_size = 40;

const styles = {
    main: css`
        position: relative;
        top: -80vh;
        z-index: 10;


        .redBox{
            ${popUpBoxStyle}
            border-color:var(--red); //#b12c2c
            background-color: #f3cdcd;
            animation-name: RBanima;
            @keyframes RBanima{
                from{
                    top: -0.5vh;
                    background-color: #f3cdcd69;
                    border-color:#b12c2c69;
                }
                to{
                    top: 0;
                    background-color: #f3cdcdff;
                    border-color:#b12c2cff;
                }
                20%{
                    top: 0;
                    background-color: #f3cdcdff;
                    border-color:#b12c2cff;
                }
            }
        }

        .greenBox{
            ${popUpBoxStyle}
            border-color:var(--nicegreen); //#4ecca3
            background-color: #cdf3d6;
            animation-name: GBanima;
            @keyframes GBanima{
                from{
                    top: -0.5vh;
                    background-color: #cdf3d669;
                    border-color:#4ecca369;
                }
                to{
                    top: 0;
                    background-color: #cdf3d6ff;
                    border-color:#4ecca3ff;
                }
                20%{
                    top: 0;
                    background-color: #cdf3d6ff;
                    border-color:#4ecca3ff;
                }
            }
        }

        .yellowBox{
            ${popUpBoxStyle}
            border-color:#ffc000ff;
            background-color: #ffe9a3ff;
            animation-name: YBanima;
            @keyframes YBanima{
                from{
                    top: -0.5vh;
                    background-color: #ffe9a369;
                    border-color:#ffc00069;
                }
                to{
                    top: 0;
                    background-color: #ffe9a3ff;
                    border-color:#ffc000ff;
                }
                20%{
                    top: 0;
                    background-color: #ffe9a3ff;
                    border-color:#ffc000ff;
                }
            }
        }

        .icon{
            height: 30px;
            margin: 2px;
        }

        .message{
            display: flex;
            justify-content: center;
            align-items: center;
        }
    `,
    overlay: css`
    position: fixed;
    z-index: 2;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    height: 100vh;
    width: 100vw;
    background-color: #000000bb;
  `,
    stickerEdit: css`
        position:absolute;
        top:10%;
        left:30%;
        width: 50%;
        margin: 0 auto;
        height: 40%;
        background-color: #ffffff;
        margin-top: 100px;
        border-radius: 10px;
        text-align: center;
        display: grid;
        grid-template-rows: 65% 15% 20%;
        z-index: 10;
    `,
    nameField: css`
    margin: 0px auto;
    border: none;
    font-weight: bold;
    width: 50%;
    border-bottom: 3px solid var(--nicegreen);
    color: var(--black);
    text-align: center;
    height: 40px;

    &:focus {
      outline: none;
    }
  `,
    CheckButtonLeft: css`
        ${checkButtonStyle};
        background-color: "#ffffff";
        border-color : #878787;
        &:hover {
          cursor: pointer;
          background-color: #dddddd;
        }
    `,
    CheckButtonRight: css`
        ${checkButtonStyle};
        background-color: var(--nicegreen);
        border-color : #247160;
        color: #ffffff;
        &:hover {
          cursor: pointer;
          background-color: #33b388;
        }
    `,
    stk: css`
        object-fit: contain;
        max-height: 23vh;
        max-width: 32vw;
        border-radius: 3px;
        draggable: false;
    `,
    cutter: css`
        
        position: absolute;
        height:40px;
        width:40px;
        max-height: 23vh;
        max-width: 23vh;
        background-color: #ffffff00;
        border: solid 2px;
        border-color : var(--nicegreen);

        overflow: auto;
        z-index: 12;
        cursor: move;
    `,
    cutterCircle: css`
        position: absolute;
        top: 40px; left: 80px;
        height:${circle_radius * 2}px;
        width:${circle_radius * 2}px;
        background-color: var(--nicegreen);
        border-radius: ${circle_radius}px;

        overflow: auto;
        z-index: 12;
        cursor: nwse-resize;
    `,
    stkCover: css`
        position: absolute;
        z-index: 11;
        height: 0;
        width: 0;
        background-color: #00000080;
        //border: solid 1px #ffff00; /*DEBUG*/
    `,
};

let fileExtension = "";
let stickerNames = [];

function addPopUp(text, type) {
    if (text) {
        let messageBox = document.createElement('div');
        let icon: HTMLImageElement = document.createElement('img');
        let message = document.createElement('div');

        switch (type) {
            case 'error':
                messageBox.className = "redBox";
                icon.src = "/img/button/error.png";
                break;
            case 'warnning':
                messageBox.className = "yellowBox";
                icon.src = "/img/button/warnning.png";
                break;
            case 'ok':
                messageBox.className = "greenBox";
                icon.src = "/img/button/ok.png";
                break;
        }

        icon.className = "icon";
        message.className = "message";
        message.innerText = text;
        messageBox.appendChild(icon)
        messageBox.appendChild(message);
        document.getElementById("main")!.appendChild(messageBox);

        setTimeout(() => {
            messageBox.style.display = 'none';
            messageBox.remove();
        }, 3000);
    }
}
function showError(text) {
    addPopUp(text, "error");
}
function showOK(text) {
    addPopUp(text, "ok");
}
function showWarnning(text) {
    addPopUp(text, "warnning");
}
function initCutter() {
    const cutter: HTMLDivElement = document.getElementById("cutter");
    const circle: HTMLDivElement = document.getElementById("circle");
    const sticker: HTMLImageElement = document.getElementById("sticker");

    if (cutter) {
        cutter.addEventListener('mousedown', (e) => {
            document.body.style.userSelect = 'none';

            if (fileExtension !== ".gif") {
                let startX = cutter.style.left;
                let startY = cutter.style.top;
                let offsetX = e.clientX;
                let offsetY = e.clientY;

                const onMouseMove = (e) => {
                    if (startX === '') {
                        startX = cutter.style.left;
                        startY = cutter.style.top;
                    }
                    let x = e.clientX - offsetX + Number(startX.split("px")[0]);
                    let y = e.clientY - offsetY + Number(startY.split("px")[0]);
                    if (x < sticker.offsetLeft) x = sticker.offsetLeft;
                    if (y < sticker.offsetTop) y = sticker.offsetTop;
                    if (x > sticker.offsetLeft + sticker.width - cutter.offsetWidth) x = sticker.offsetLeft + sticker.width - cutter.offsetWidth;
                    if (y > sticker.offsetTop + sticker.height - cutter.offsetHeight) y = sticker.offsetTop + sticker.height - cutter.offsetHeight;
                    cutter.style.left = `${x}px`;
                    cutter.style.top = `${y}px`;
                    circle.style.left = `${x + cutter.offsetWidth - circle_radius}px`;
                    circle.style.top = `${y + cutter.offsetHeight - circle_radius}px`;
                    setStkCover();
                };

                const onMouseUp = () => {
                    document.body.style.userSelect = 'auto';
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                };

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            } else {
                showWarnning("暫不支持對gif的編輯");
            }
        });
        circle.addEventListener('mousedown', (e) => {
            if (fileExtension !== ".gif") {
                document.body.style.userSelect = 'none';

                let startX = circle.style.left;
                let startY = circle.style.top;
                let startW = cutter.offsetWidth;
                let startH = cutter.offsetHeight;
                let offsetX = e.clientX;
                let offsetY = e.clientY;

                const onMouseMove = (e) => {
                    if (startX === '') {
                        startX = circle.style.left;
                        startY = circle.style.top;
                    }
                    let delta = Math.max(e.clientX - offsetX, e.clientY - offsetY);
                    let x = Number(startX.split("px")[0]);
                    let y = Number(startY.split("px")[0]);
                    if (x + delta < cutter.offsetLeft + cutter_min_size) delta = cutter.offsetLeft + cutter_min_size - x;
                    if (y + delta < cutter.offsetTop + cutter_min_size) delta = cutter.offsetTop + cutter_min_size - y;
                    if (x + delta > sticker.offsetLeft + sticker.width - circle_radius) delta = sticker.offsetLeft + sticker.width - circle_radius - x;
                    if (y + delta > sticker.offsetTop + sticker.height - circle_radius) delta = sticker.offsetTop + sticker.height - circle_radius - y;

                    x = delta + Number(startX.split("px")[0]);
                    y = delta + Number(startY.split("px")[0]);
                    circle.style.left = `${x}px`;
                    circle.style.top = `${y}px`;
                    cutter.style.width = startW + delta + "px";
                    cutter.style.height = startH + delta + "px";
                    setStkCover();
                };

                const onMouseUp = () => {
                    document.body.style.userSelect = 'auto';
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                };

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            } else {
                showWarnning("暫不支持對gif的編輯");
            }
        });
    }
}
function initOthers() {
}
function setCutterPosition() {
    const cutter: HTMLDivElement = document.getElementById("cutter");
    const circle: HTMLDivElement = document.getElementById("circle");
    const sticker: HTMLImageElement = document.getElementById("sticker");
    console.log(sticker.offsetWidth, sticker.offsetHeight);
    let side_length;
    if (sticker.offsetWidth >= sticker.offsetHeight) {
        side_length = sticker.offsetHeight;
        cutter.style.left = sticker.offsetLeft + (sticker.offsetWidth - side_length) / 2 + "px";
        cutter.style.top = sticker.offsetTop + "px";
    }
    else {
        side_length = sticker.offsetWidth;
        cutter.style.left = sticker.offsetLeft + "px";
        cutter.style.top = sticker.offsetTop + (sticker.offsetHeight - side_length) / 2 + "px";
    }
    cutter.style.width = cutter.style.height = side_length + "px";
    circle.style.left = cutter.offsetLeft + side_length - circle_radius + "px";
    circle.style.top = cutter.offsetTop + side_length - circle_radius + "px";

    setStkCover();
}
function editSticker(fileName: string, base64, _stickerNames) {
    const fileNameInput: HTMLInputElement = document.getElementById("fileNameInput");
    const sticker: HTMLImageElement = document.getElementById("sticker");
    const editorArea: HTMLDivElement = document.getElementById("editorArea");
    fileNameInput.value = fileName.split('.')[0];
    fileExtension = '.' + fileName.split('.')[fileName.split('.').length - 1];
    sticker.src = base64;
    sticker.onload = () => {
        editorArea.hidden = false;
        setCutterPosition();
        setStkCover();
    }
    stickerNames = _stickerNames;
}
function setStkCover() {
    const cutter: HTMLDivElement = document.getElementById("cutter");
    const circle: HTMLDivElement = document.getElementById("circle")
    const sticker: HTMLImageElement = document.getElementById("sticker");
    const stkCoverU: HTMLDivElement = document.getElementById("stkCoverU");
    const stkCoverL: HTMLDivElement = document.getElementById("stkCoverL");
    const stkCoverR: HTMLDivElement = document.getElementById("stkCoverR");
    const stkCoverD: HTMLDivElement = document.getElementById("stkCoverD");

    stkCoverU.style.top = sticker.offsetTop + "px";
    stkCoverU.style.left = sticker.offsetLeft + "px";
    stkCoverU.style.width = sticker.offsetWidth + 1 + "px";
    stkCoverU.style.height = cutter.offsetTop - sticker.offsetTop + "px";

    stkCoverD.style.top = cutter.offsetTop + cutter.offsetHeight + "px";
    stkCoverD.style.left = sticker.offsetLeft + "px";
    stkCoverD.style.width = sticker.offsetWidth + 1 + "px";
    stkCoverD.style.height = sticker.offsetHeight - (cutter.offsetTop - sticker.offsetTop + cutter.offsetHeight) + "px";

    stkCoverL.style.top = cutter.offsetTop + "px";
    stkCoverL.style.left = sticker.offsetLeft + "px";
    stkCoverL.style.width = cutter.offsetLeft - sticker.offsetLeft + "px";
    stkCoverL.style.height = cutter.offsetHeight + "px";

    stkCoverR.style.top = cutter.offsetTop + "px";
    stkCoverR.style.left = cutter.offsetLeft + cutter.offsetWidth + "px";
    stkCoverR.style.width = sticker.offsetWidth - (cutter.offsetLeft - sticker.offsetLeft + cutter.offsetWidth) + 1 + "px";
    stkCoverR.style.height = cutter.offsetHeight + "px";
}

export const PopUp = () => {
    const { getEventBus } = useEventBus()
    const eventBus = getEventBus();
    useEffect(() => {
        initCutter();
        initOthers();
        eventBus.on("errorMessage", showError);
        eventBus.on("okMessage", showOK);
        eventBus.on("editSticker", editSticker);
        onresize = setCutterPosition;
    }, []);

    return (
        <>
            <div id="main" css={styles.main} >

            </div>
            <div id="editorArea" hidden>
                <div css={styles.stickerEdit} >
                    <div css={{ margin: "10px 10px 0" }}>
                        <div css={styles.cutter} id="cutter" />
                        <div css={styles.cutterCircle} id="circle" />
                        <div>
                            <img css={styles.stk} id="sticker" draggable="false" />
                        </div>
                        <div css={css`${styles.stkCover};border-radius: 3px 3px 0 0;`} id="stkCoverU" />
                        <div css={styles.stkCover} id="stkCoverL" />
                        <div css={styles.stkCover} id="stkCoverR" />
                        <div css={css`${styles.stkCover};border-radius: 0 0 3px 3px;`} id="stkCoverD" />
                    </div>
                    <div css={{ width: "80%", margin: "auto" }}>
                        Name:
                        <input
                            id="fileNameInput"
                            css={styles.nameField}
                            placeholder="sticker1"
                        />
                        {fileExtension}
                    </div>
                    <div css={{ display: "grid", 'grid-template-columns': "50% 50%" }} >
                        <button css={styles.CheckButtonLeft} id="CancelButton" onClick={() => {
                            const editorArea: HTMLDivElement = document.getElementById("editorArea");
                            editorArea.hidden = true;
                        }}>
                            Cancel
                        </button>
                        <button css={styles.CheckButtonRight} id="confirmButton" onClick={() => {
                            const fileName = fileNameInput.value;
                            // TODO: Conflicting names detect
                            if (fileName === '') showError("請輸入貼圖名稱");
                            else if (fileName.indexOf('.') + fileName.indexOf(' ') + fileName.indexOf(':') > -3) 
                                showError("請避免空格、冒號、以及句點在貼圖名稱中");
                            else {
                                if (stickerNames.indexOf(fileName)>-1) {
                                    showError("該貼圖名稱已存在");
                                } else {
                                    const editorArea: HTMLDivElement = document.getElementById("editorArea");
                                    const cutter: HTMLDivElement = document.getElementById("cutter");
                                    const sticker: HTMLImageElement = document.getElementById("sticker");
                                    eventBus.emit("sendSticker", fileName + fileExtension, cutter.offsetLeft - sticker.offsetLeft, cutter.offsetTop - sticker.offsetTop, cutter.offsetWidth, sticker.offsetWidth); /*name, x, y, side length, picWidth*/
                                    editorArea.hidden = true;
                                    showOK("貼圖上傳成功！");
                                }
                            }
                        }}>
                            Confirm
                        </button>
                    </div>
                </div>
                <div css={styles.overlay} />
            </div>
        </>
    );
};