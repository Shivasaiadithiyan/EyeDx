import 'package:flutter/material.dart';
import 'package:oct_system/pages/login_page.dart';
import 'package:oct_system/utils/auth.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'OCT Diagnosis',
      theme: ThemeData.dark().copyWith(
        primaryColor: Colors.teal,
        scaffoldBackgroundColor: Colors.black,
        colorScheme: ColorScheme.dark().copyWith(
          secondary: Colors.tealAccent, // Replacing accentColor
        ),
        textTheme: TextTheme(
          bodyLarge: TextStyle(color: Colors.white),
          bodyMedium:  TextStyle(color: Colors.white),
          bodySmall:  TextStyle(color: Colors.white),
        ),
      ),
      home: FutureBuilder<bool>(
        future: Auth.isLoggedIn(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          }
          return snapshot.data! ? Auth.dashboard : LoginPage();
        },
      ),
    );
  }
}
