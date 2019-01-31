import React from 'react';
import axios from 'axios';
import _ from 'lodash';

import MyProfile from '../components/MyProfile';
import UserProfile from '../components/UserProfile';
import Loader from '../components/Loader';

const getRandomNum = () => (Math.floor(Math.random() * 206));
class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isSelf: false,
			userProfile: {},
			loading: false,
			error: false,
		}
	}

	componentDidMount() {
		const paramsId = _.get(this.props, 'match.params.id', null);
		this.fetchUser(paramsId)
	}

	componentWillReceiveProps = (nextProps) => {
		this.setState({
			isSelf: true,
			userProfile: nextProps.user,
			error: false,
		})
	}

	componentDidUpdate() {
		const { loading, error } = this.state;
		const { user } = this.props;
		if (loading || error) return;

		const selfProfileId = _.get(user, '_id', '');
		const stateUserId = _.get(this.state, 'userProfile._id', '');
		const paramsUserId = _.get(this.props, 'match.params.id', null);
		const changedProfile = stateUserId !== paramsUserId;

		// FETCH OTHER PROFILES
		if((paramsUserId && paramsUserId !== selfProfileId) && changedProfile ) {
			this.fetchUser(paramsUserId)
			return;
		}

		// FETCH SELF PROFILE
		if(!stateUserId && (!paramsUserId || paramsUserId === selfProfileId) || stateUserId && (!paramsUserId && stateUserId !== selfProfileId || paramsUserId && paramsUserId === selfProfileId && stateUserId !==selfProfileId)){
			this.fetchUser()
		}

	}

	async fetchUser(id) {
		// IF PROFILE SET STATE DATA TO CURRENT LOGGED IN USER
		if(!id) {

			this.setState({
				isSelf: true,
				userProfile: this.props.user,
			})
			return
		}

		// FETCH USER IF NOT PROFILE
		await this.setState({
			loading: true,
		})
		
		axios(`/api/profile/${id}`)
			.then(({data}) => {
				if(!data.userPageData) {
					return this.setState({
						userProfile: {},
						loading: false,
						error: true,
						isSelf: false,
					})
				}
				return this.setState({
					isSelf: false,
					error: false,
					userProfile: data.userPageData,
					loading: false,
				})
			})
			.catch(() => {
				this.setState({
					userProfile: {},
					loading: false,
					error: true,
					isSelf: false,
				})

			})
		

	}

	renderUser() {
		const { userProfile, isSelf } = this.state;

		if(_.isEmpty(userProfile)) {
			return <h1 style={{textAlign: 'center'}}>User not found</h1>
		}
		return (
			<div className="profile-user-page card">
				{
					isSelf ?
						<MyProfile loading={this.props.loading} handleEditUser={this.props.handleEditUser} handleDeleteAvatar={this.props.handleDeleteAvatar} handleUploadAvatar={this.props.handleUploadAvatar} random={getRandomNum()} user={userProfile} />
						:
						<UserProfile random={getRandomNum()} user={userProfile} />
				}
			</div>
		)
	}

	render() {
		const { loading } = this.state;

		return (
			<div className="content-profile-page">
				{
					loading?
						<Loader />
						:
						this.renderUser()
				}
			</div>
		);
	}
}

export default Profile;
