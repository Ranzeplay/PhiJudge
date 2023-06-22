import { CaretRight } from "@carbon/icons-react";
import { Stack, TextInput, Form, Button, Link, InlineNotification } from "carbon-components-react";
import { BASE_URL } from "../constants";
import React from "react";

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = { email: "", password: "" }

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleEmailChange(event) {
        this.setState({ email: event.target.value });
    }

    handlePasswordChange(event) {
        this.setState({ password: event.target.value });
    }

    handleSubmit() {
        this.submit(this.state.email, this.state.password).finally(() => { });
    }

    async submit(email, password) {
        var formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        var options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            mode: 'cors',
        };

        await fetch(BASE_URL + "/api/user/signin", options)
            .then(async response => {
                var message = await response.text();
                if (response.ok) {
                    var jwtToken = message;

                    localStorage.setItem('authorization_token', jwtToken);
                } else {
                    document.getElementById('notification').setAttribute('message', message);
                    document.getElementById('notification').classList.toggle('hidden');
                }
            });
    }

    render() {
        return (
            <div className="w-1/2 m-auto">
                <h2 className="text-4xl font-semibold mb-2">Sign in</h2>
                <Form className="mt-4">
                    <Stack gap={6}>
                        <TextInput id="email-input"
                            value={this.state.email}
                            onChange={this.handleEmailChange}
                            type="email"
                            required
                            labelText="Email" />
                        <TextInput id="password-input"
                            value={this.state.password}
                            onChange={this.handlePasswordChange}
                            type="password"
                            required
                            labelText="Password" />
                        <Button type="button" onClick={this.handleSubmit}>Submit</Button>
                        <Link href="/auth/signup">
                            <CaretRight size={20} />
                            No account? Go sign up
                        </Link>
                        <InlineNotification id="notification" className="hidden" title="Error" message="Unknown error" />
                    </Stack>
                </Form>
            </div>
        )
    }
}



export default SignIn;
