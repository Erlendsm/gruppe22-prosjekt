import React from 'react';
import ReactDOM from 'react-dom';
import { userService } from '../../../services';
import createHashHistory from 'history/createHashHistory';

const history: HashHistory = createHashHistory();

export default class EventInfo extends React.Component {
	constructor(props) {
		super(props);
		this.arrangement = {};
    this.allSelectedRoles = [];
    this.allRoles = [];
    this.id = props.match.params.id;
    this.numberOfRoles = [];
    this.firstNumberOfRoles = [];
    this.secondNumberOfRoles = [];
    this.difference = [];
    this.eventRoller = [];
    this.allUsers = [];
    this.roleKomp = [];
    this.userWithRoles = [];
    this.selectedUser = [];
    this.usedUser = [];
		this.allWatchList=[];
		this.interestedUsers = [];
		this.state = {
      activeUser: null,
	   	users: [],
			interessedUser: []

		}
	}

	render() {
		let signedInUser = userService.getSignedInUser();

		let watchList = [];
		let roleList = [];
		let roleListAdmin = [];
		let inc = 0;


		for (let watch of this.allWatchList) {
 	 	watchList.push(<tr key= {watch.roleid}> <td className="td"> {watch.title} </td>
 	 	                                       <td className="td"> {watch.firstname} </td> </tr>);

 	 }

		for (let role of this.allSelectedRoles) {
			roleList.push(<tr key={role.arr_rolleid} ><td> {role.title} </td></tr>);
		}

		for (let role of this.allRoles) {
			roleListAdmin.push(
				<tr key={role.roleid}>
					<td className="td">{role.roleid}</td>
					<td className="td">{role.title}</td>
					<td className="table">{this.numberOfRoles[inc]}</td>
					<td className="table">
						<button onClick={() => {
							this.secondNumberOfRoles[role.roleid - 1]++;
							this.forceUpdate();
						}}>+</button></td>
					<td className="table">
						<button onClick={() => {
							if (this.secondNumberOfRoles[role.roleid - 1] > 0) {
								this.secondNumberOfRoles[role.roleid - 1]--;
							}
							this.forceUpdate();
						}}>-</button></td>
				</tr>
			);
			inc++;
		}

		if (signedInUser.admin == 0) {

			return (
				<div className="menu">
					<div>
						<h1>{this.arrangement.title} informasjon side.</h1> <br />
						{this.start}
					</div> <br />
					<div>
						Oppmøte lokasjon:{this.arrangement.meetingLocation}<br />
						Oppmøte tidspunkt: {this.show} <br />
						Planlagt slutt: {this.end}
					</div> <br />
					<div style={{ width: 300 }}>
						Beskrivelse: <br />
						{this.arrangement.description} <br />
					</div>

					<div> <h4>Er du interessert i dette arrangementet trykker du her: <button type="button" onClick={() => this.getInteressed(this.arrangement.id, this.state.activeUser)}>Interessert</button></h4></div>
					<div>
						<h4>Roller som kreves for dette arrangementet:</h4> <br />
						<table>
							<tbody>
								{roleList}
							</tbody>
						</table>
						<br />
						Har du spørsmål vedrørende dette arrangementet kontakt {this.arrangement.contactPerson}
					</div>
				</div>
			)
		}
		else {
			return (
				<div className="menu">
					<div>
						<h1>{this.arrangement.title} informasjon side.</h1> <br />
						{this.start}
					</div> <br />

					<div>Interesserte brukere: {this.state.users} <br></br><button type="button" onClick={() => this.getInteressedUsers(this.arrangement.id)}>Vi interesserte</button> </div>
					<div>
						Oppmøte lokasjon:{this.arrangement.meetingLocation}<br />
						Oppmøte tidspunkt: {this.show} <br />
						Planlagt slutt: {this.end}
					</div> <br />
					<div style={{ width: 300 }}>
						Beskrivelse: <br />
						{this.arrangement.description} <br />
					</div>
					<div>
						<h4>Roller som kreves for dette arrangementet:</h4> <br />
						<table className="table" id="myTable">
							<tbody>
								<tr> <th className="th">Nr</th> <th className="th">Tittel</th> <th className="th">Antall</th> <th className="th">Legg til</th> <th className="th">Trekk fra</th> </tr>
								{roleListAdmin}
							</tbody>
						</table> <br />
						<h4> Vakter som er utdelt</h4>
            <table className="table" id="myTable">
						<tbody>
						<tr> <th className="th">Rolle</th> <th className="th">Deltaker</th><th className="th">Godkjent</th> </tr>
	             {watchList}
						</tbody>
						</table> <br />
						<button ref="endreRoller" className="button">Endre Roller</button>
						<br />
						<br />
			      <button ref="tildelRoller" className="button">Generer vaktlister</button>
						Har du spørsmål vedrørende dette arrangementet kontakt {this.arrangement.contactPerson}
					</div>
				</div>
			)
		}
	}

	componentDidMount() {

		let signedInUser = userService.getSignedInUser();
		this.setState({
				activeUser: userService.getSignedInUser()["id"],
        interessedUser: userService.checkIfInteressed()

		});

		userService.getArrangementInfo(this.id).then((result) => {
			this.arrangement = result;
			this.start = this.arrangement.start.toLocaleString().slice(0, -3);
			this.end = this.arrangement.end.toLocaleString().slice(0, -3);
			this.show = this.arrangement.showTime.toLocaleString().slice(0, -3);
			if(signedInUser.admin == 1) {
				userService.getEventRolleinfo(this.arrangement.id).then((result) => {
					this.eventRoller = result;
					this.forceUpdate();
				});
			}
			userService.getWatchList(this.arrangement.id).then((result) => {
				this.allWatchList = result;
				this.forceUpdate();

			})

			userService.getRolesForArr(this.arrangement.id).then((result) => {
				this.allSelectedRoles = result;

				this.forceUpdate();
			});


		});

		if(signedInUser.admin == 1) {
			userService.getAllRoles().then((result) => {
				this.allRoles = result;
				for (var i = 1; i < this.allRoles.length +1; i++) {

					userService.getRoleCount(this.arrangement.id, i).then((result) => {
						this.numberOfRoles.push(result);
						this.firstNumberOfRoles.push(result);
						this.secondNumberOfRoles = this.numberOfRoles;
						this.forceUpdate()
					})
				}
			})


		this.refs.endreRoller.onclick = () => {



			for (var i = 0; i < this.allRoles.length; i++) {
				if (this.secondNumberOfRoles[i] != this.firstNumberOfRoles[i]) {
					this.difference.push(this.secondNumberOfRoles[i] - this.firstNumberOfRoles[i]);

				}
				else if(this.secondNumberOfRoles[i] == this.firstNumberOfRoles[i]) {
					this.difference.push(0);
				}
			}
			if (this.difference == this.firstNumberOfRoles) {
				this.props.history.push('/eventinfo/' + this.arrangement.id);

			}
			else {
					for (var i = 1; i < this.allRoles.length; i++) {
						if (this.difference[i -1] > 0) {

							for (var y = 0; y < this.difference[i -1]; y++) {
								userService.addRolesforArrSingle(this.arrangement.id, i).then((result) => {
								})
							}
						}
						else if(this.difference[i-1] < 0) {

							for (var y = 0; y < -(this.difference[i -1]); y++) {
								userService.deleteRolesfromArr(this.arrangement.id, i).then((result) => {
								});
							}
						}
					}
					userService.getAllRoles().then((result) => {
						this.allRoles = result;
						for (var i = 1; i < this.allRoles.length +1; i++) {

							userService.getRoleCount(this.arrangement.id, i).then((result) => {

								this.numberOfRoles.push(result);
								this.firstNumberOfRoles.push(result);
								this.secondNumberOfRoles = this.numberOfRoles;
								this.forceUpdate()
							})
						}
					})
				}
			}
			userService.getAllUsers().then((result) => {
				this.allUsers = result;
				this.forceUpdate();
				})
			this.refs.tildelRoller.onclick = () => {
				let usedUser = [];
				let usedEventRoles = [];
					for(let eventRolle of this.allSelectedRoles) {
						userService.getUsedUsers(eventRolle.arr_rolleid).then((result) => {
							usedUser.push(result)
						});
						userService.getUsedEventRoles(eventRolle.arrid, eventRolle.arr_rolleid).then((result) => {
							usedEventRoles.push(result)
						});
						userService.getRoleKomp(eventRolle.roleid, eventRolle.arr_rolleid).then((result) => {
							this.roleKomp= result;
						});

							for(let user of this.allUsers) {

								userService.getUserRoleKomp(eventRolle.roleid, eventRolle.arrid, user.id, eventRolle.arr_rolleid).then((result) => {
									if(result.length != 0){
										this.userWithRoles = result;
										}

										for (var i = 0; i < this.allSelectedRoles.length; i++) {
											let exists = usedUser.includes(user.id);
											let hasUser = usedEventRoles.includes(eventRolle.arr_rolleid);


												if (exists == false && hasUser == false && this.roleKomp.length == this.userWithRoles.length) {
													console.log(exists)
													usedUser.push(user.id)
													usedEventRoles.push(eventRolle.arr_rolleid)

													userService.addUserForRole(user.id, eventRolle.arr_rolleid, eventRolle.arrid).then((result) => {
														console.log(result)
													})
												}
											}
										})
									}
								}
							}
						}
					}

					getInteressed(arrangementId, userId) {
                userService.checkIfInteressed(this.state.activeUser, this.arrangement.id).then((result) => {
									this.state.interessedUser = result;
									this.forceUpdate();
									if(this.state.interessedUser == 0){
										this.state.activeUser = userId;
						        userService.getInteressed(arrangementId, userId).then((result) => {
						            this.forceUpdate();
						        })
									}
									else {
										alert("du er allerede registrert som interessert")
									}
								})
							};

					getInteressedUsers() {

						var rolesAvailableForArrangement = [];
						userService.getRolesForArr(this.arrangement.id).then((result) => {
							for (let role of result) {
								rolesAvailableForArrangement.push(<option value={role.arr_rolleid}>{role.title}</option>);
							}
						});

						userService.getInteressedUsers(this.arrangement.id).then((result) => {
							var users = [];

							result.forEach(function (user) {
								users.push(
									<div>
										<li>{user.firstname + " "}</li>
										<select onChange={function(e) {userService.UpsertRoleForArrangement(user.userId, e.target.value)}}>
											<option value={null} selected>-- Velg ledig rolle -- </option>
											{rolesAvailableForArrangement}

										</select>
									</div>
								);
							});
							this.state.users = users;

							this.forceUpdate();
						});
					}
}
