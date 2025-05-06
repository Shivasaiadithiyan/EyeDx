import 'package:flutter/material.dart';
import 'package:oct_system/services/api_service.dart';
import 'login_page.dart';

class SignupPage extends StatefulWidget {
  @override
  State<SignupPage> createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _loading = false;
  String? _message;

  Future<void> _signup() async {
    setState(() {
      _loading = true;
      _message = null;
    });

    final error = await ApiService.signup(
      _emailController.text.trim(),
      _passwordController.text,
    );

    setState(() {
      _loading = false;
      _message = error ?? "Signup successful! Check your email for Login Key.";
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Patient Signup")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _emailController,
              decoration: InputDecoration(labelText: "Email"),
              keyboardType: TextInputType.emailAddress,
            ),
            TextField(
              controller: _passwordController,
              obscureText: true,
              decoration: InputDecoration(labelText: "Password"),
            ),
            if (_message != null)
              Padding(
                padding: const EdgeInsets.only(top: 12.0),
                child: Text(
                  _message!,
                  style: TextStyle(
                    color: _message!.contains("successful")
                        ? Colors.green
                        : Colors.red,
                  ),
                ),
              ),
            const SizedBox(height: 24),
            _loading
                ? CircularProgressIndicator()
                : ElevatedButton(
              onPressed: _signup,
              child: Text("Signup"),
            ),
            TextButton(
              onPressed: () {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (_) => LoginPage()),
                );
              },
              child: Text("Already have an account? Login"),
            )
          ],
        ),
      ),
    );
  }
}
