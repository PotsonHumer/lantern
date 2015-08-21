var React = require('react');
var Link = require('react-router-component').Link;
var Fluky = require('fluky');

var Header = require('./Header.jsx');

class SignInPage extends React.Component {

	static contextTypes = {
		router: React.PropTypes.object
	};

	constructor() {
		super();

		this.state = {
			error: false
		};
	}

	componentWillMount = () => {
		Fluky.on('store.User', Fluky.bindListener(this.onChange));
	}

	componentWillUnmount = () => {
		Fluky.off('store.User', this.onChange);
	}

	signIn = () => {
		Fluky.dispatch('action.User.signIn',
			this.refs.email.getDOMNode().value,
			this.refs.password.getDOMNode().value);
	}

	onChange = () => {

		Fluky.dispatch('store.User.getState', function(user) {

			// No need to sign in if logined already
			if (user.logined) {
				this.context.router.navigate('/');
				return;
			}

			if (user.status == 'login-failed') {

				// Clear password inputbox
				this.refs.password.getDOMNode().value = ''; 

				// Focus on email inputbox
				this.refs.email.getDOMNode().select();

				this.setState({
					error: true
				});
			}
		}.bind(this));
	}

	render() {
		var message;
		var fieldClass = 'field';
		if (this.state.error) {
			fieldClass += ' error';
			message = (
				<div className='ui negative icon message'>
					<i className={'warning sign icon'} />
					<div className='content'>
						<div className='header'>Failed to Sign In</div>
						<p>Please check your email and password then try again</p>
					</div>
				</div>
			);
		}

		return (
			<div>
				<Header />
				<div className='ui hidden divider'></div>
				<div className='ui hidden divider'></div>
				<div className={'ui basic center aligned padded segment'}>

					<div className='ui two column centered grid'>
						<div className='column'>
							<h1 className='ui header'>
								<i className='sign in icon' />
								<div className='content'>Sign In</div>
							</h1>
							<div className={'ui basic segment'}>
								{message}

								<div className='ui form'>

									<div className={fieldClass}>
										<div className={'ui left icon input'}>
											<i className={'user icon'} />
											<input type='text' ref='email' name='email' placeholder='E-mail address' autoFocus={true} />
										</div>
									</div>
									<div className={fieldClass}>
										<div className={'ui left icon input'}>
											<i className={'lock icon'} />
											<input type='password' ref='password' name='password' placeholder='Password' />
										</div>
									</div>
									<div className='field'>
										<button className='ui teal button' onClick={this.signIn}>Sign In</button>
									</div>
									<div className='field ui teal message'>
										No Account yet? <Link href='/signup'>Sign Up</Link>
									</div>
								</div>
							</div>
						</div>

					</div>

				</div>
			</div>
		);
	}
}

module.exports = SignInPage;
