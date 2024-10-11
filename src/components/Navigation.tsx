'use client';

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

const Navigation: React.FC = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Finance Tracker
        </Typography>
        <Box>
          {session ? (
            <>
              <Button color="inherit" component={Link} href="/" selected={pathname === '/'}>
                Dashboard
              </Button>
              <Button color="inherit" component={Link} href="/transactions" selected={pathname === '/transactions'}>
                Transactions
              </Button>
              <Button color="inherit" component={Link} href="/reports" selected={pathname === '/reports'}>
                Reports
              </Button>
              <Button color="inherit" onClick={() => signOut()}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} href="/login" selected={pathname === '/login'}>
                Login
              </Button>
              <Button color="inherit" component={Link} href="/signup" selected={pathname === '/signup'}>
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
