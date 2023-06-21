import { Stack, TextInput, Form, Button } from "carbon-components-react";

function SignIn() {
    return (
        <div className="w-1/2 m-auto">
            <h2 className="text-4xl font-semibold">Sign in</h2>
            <Form className="mt-4">
                <Stack gap={7}>
                <TextInput id="email-input"
                        type="email"
                        required
                        labelText="Email" />
                    <TextInput id="password-input"
                        type="password"
                        required
                        labelText="Password" />
                    <Button type="submit">Submit</Button>
                </Stack>
            </Form>
        </div>
    )
}

export default SignIn;
