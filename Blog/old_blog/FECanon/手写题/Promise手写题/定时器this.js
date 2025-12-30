const obj = {
    name: 'Alice',
    greet: () => {
        console.log(this.name);
    },
    setTime: function () {
        setTimeout(() => {
            console.log(this);
            console.log(this.name);
        }, 1000);
    }
};
obj.setTime();
