import './Toast.scss';

export default class Toast {

}

Toast.message = () => {

};

Toast.createContainer = () => {
  if (!this.container) return;
  this.container = document.createElement('div');
  this.container.className = 'toaster-message';
  document.body.appendChild(this.container);
};

Toast.createMessage = (text) => {
  this.lastMessage = document.createElement('div');
  this.lastMessage.className = 'message show';
  this.lastMessage.innerText = text;
  this.container.appendChild(this.lastMessage);
};

Toast.render = (text) => {
  Toast.createContainer();

  // setTimeout(() => {
  //   this.container.className = this.container.className.replace('show', '');
  // }, this.props.time);

  // return (
  //   <div className='c-toaster'>
  //     <i className={`fa fa-${this.props.type}`} aria-hidden="true"></i>
  //     {this.props.message || this.props.children}
  //   </div>
  // );

};
