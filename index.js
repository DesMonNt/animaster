addListeners();

let STOP = null;

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', animaster().addFadeIn(5000).buildHandler());

    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = this.closest('.container').querySelector('.block');
            if (block) animaster().reset(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', animaster().addMove(1000, { x: 100, y: 10 }).buildHandler());

    document.getElementById('moveReset')
        .addEventListener('click', function () {
            const block = this.closest('.container').querySelector('.block');
            if (block) animaster().reset(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', animaster().addScale(1000, 1.25).buildHandler());

    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            const block = this.closest('.container').querySelector('.block');
            if (block) animaster().reset(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', animaster().addFadeOut(1000).buildHandler());

    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            const block = this.closest('.container').querySelector('.block');
            if (block) animaster().reset(block);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = this.closest('.container').querySelector('.block');
            if (block) animaster().moveAndHide(block, 3000);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = this.closest('.container').querySelector('.block');
            if (block) animaster().reset(block);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = this.closest('.container').querySelector('.block');
            if (block) animaster().showAndHide(block, 3000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = this.closest('.container').querySelector('.block');
            if (block) STOP = animaster().heartBeating(block);
        });

    document.getElementById('11')
        .addEventListener('click', function () {
            if (STOP) STOP.stop();
        });

    document.getElementById('customAnimationPlay')
        .addEventListener('click', function () {
            const block = this.closest('.container').querySelector('.block');
            if (block) {
                const customAnimation = animaster()
                    .addMove(200, { x: 40, y: 40 })
                    .addScale(800, 1.3)
                    .addMove(200, { x: 80, y: 0 })
                    .addScale(800, 1)
                    .addMove(200, { x: 40, y: -40 })
                    .addScale(800, 0.7)
                    .addMove(200, { x: 0, y: 0 })
                    .addScale(800, 1);
                customAnimation.play(block);
            }
        });

    const worryAnimationHandler = animaster()
        .addMove(200, { x: 80, y: 0 })
        .addMove(200, { x: 0, y: 0 })
        .addMove(200, { x: 80, y: 0 })
        .addMove(200, { x: 0, y: 0 })
        .buildHandler();

    document.getElementById('worryAnimationBlock')
        .addEventListener('click', worryAnimationHandler);
}



function animaster() {
    return {
        _steps: [],

        moveAndHide(element, duration) {
            return this.addMove(duration * 2 / 5, { x: 100, y: 20 })
                .addFadeOut(duration * 3 / 5)
                .play(element);
        },

        showAndHide(element, duration) {
            return this.addFadeIn(duration / 3)
                .addDelay(duration / 3)
                .addFadeOut(duration / 3)
                .play(element);
        },

        heartBeating(element) {
            return this.addScale(500, 1.4)
                .addScale(500, 1)
                .play(element, true);
        },

        reset(element) {
            element.style.transitionDuration = null;
            element.style.transform = null;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        addMove(duration, translation) {
            this._steps.push({ type: 'move', duration, translation });
            return this;
        },

        addScale(duration, ratio) {
            this._steps.push({ type: 'scale', duration, ratio });
            return this;
        },

        addFadeIn(duration) {
            this._steps.push({ type: 'fadeIn', duration });
            return this;
        },

        addFadeOut(duration) {
            this._steps.push({ type: 'fadeOut', duration });
            return this;
        },

        addDelay(duration) {
            this._steps.push({ type: 'delay', duration });
            return this;
        },

        play(element, cycled = false) {
            let delay = 0;
            let stopFlag = false;

            const runAnimation = () => {
                let totalTime = 0;

                this._steps.forEach(step => {
                    setTimeout(() => {
                        if (stopFlag) return;
                        if (step.type === 'move') {
                            element.style.transitionDuration = `${step.duration}ms`;
                            element.style.transform = getTransform(step.translation, null);
                        } else if (step.type === 'scale') {
                            element.style.transitionDuration = `${step.duration}ms`;
                            element.style.transform = getTransform(null, step.ratio);
                        } else if (step.type === 'fadeIn') {
                            element.style.transitionDuration = `${step.duration}ms`;
                            element.classList.remove('hide');
                            element.classList.add('show');
                        } else if (step.type === 'fadeOut') {
                            element.style.transitionDuration = `${step.duration}ms`;
                            element.classList.remove('show');
                            element.classList.add('hide');
                        }
                    }, totalTime);
                    totalTime += step.duration;
                });

                if (cycled) {
                    setTimeout(runAnimation, totalTime);
                }
            };

            runAnimation();

            return {
                stop() {
                    stopFlag = true;
                },
                reset() {
                    stopFlag = true;
                    element.style.transitionDuration = null;
                    element.style.transform = null;
                    element.classList.remove('hide');
                    element.classList.add('show');
                }
            };
        },

        buildHandler() {
            const animationSteps = [...this._steps];
            return function (event) {
                const block = event.currentTarget.closest('.container').querySelector('.block');
                if (block) {
                    const anim = animaster();
                    anim._steps = animationSteps;
                    anim.play(block);
                }
            };
        }
    };
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}
