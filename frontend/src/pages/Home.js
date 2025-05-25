import React from 'react';
import {
  Button,
  CssBaseline,
  Stack,
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  alpha
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  LocalGasStation as LocalGasStationIcon,
  DirectionsCar as CarIcon,
  Store as StoreIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Visibility as VisibilityIcon,
  QrCode as QrCodeIcon,
  Analytics as AnalyticsIcon,
  CheckCircle as CheckIcon,
  ArrowForward as ArrowIcon,
  TrendingUp as TrendingUpIcon,
  Shield as ShieldIcon,
  Timer as TimerIcon
} from '@mui/icons-material';

export default function Home() {
  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Secure & Reliable',
      description: 'Advanced QR code system ensures secure fuel distribution with real-time validation.',
      color: '#2e7d32' // success.main from your theme
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Fast Processing',
      description: 'Quick scanning and instant quota verification for efficient fuel station operations.',
      color: '#0288d1' // info.main from your theme
    },
    {
      icon: <VisibilityIcon sx={{ fontSize: 40 }} />,
      title: 'Real-time Tracking',
      description: 'Monitor fuel usage, quota status, and transaction history in real-time.',
      color: '#ed6c02' // warning.main from your theme
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      title: 'Comprehensive Analytics',
      description: 'Detailed reports and analytics for better fuel distribution management.',
      color: '#d32f2f' // error.main from your theme
    }
  ];

  const benefits = [
    'Digital QR code-based verification',
    'Real-time quota management',
    'Automated transaction tracking',
    'Mobile-friendly interface',
    'Comprehensive reporting system',
    'Multi-role access control'
  ];

  return (
    <>
      <CssBaseline />
      <main>
        {/* Hero Section */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${alpha('#1976d2', 0.1)} 0%, ${alpha('#42a5f5', 0.05)} 100%)`,
            pt: { xs: 8, md: 12 },
            pb: { xs: 8, md: 12 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23e3f2fd" fill-opacity="0.3"%3E%3Cpath d="M20 20c0-11.046-8.954-20-20-20v20h20z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              opacity: 0.1,
            }
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Stack spacing={4}>
                  <Box>
                    <Chip 
                      icon={<TrendingUpIcon />}
                      label="Modern Fuel Management System" 
                      sx={{ 
                        mb: 3, 
                        bgcolor: alpha('#1976d2', 0.1),
                        color: 'primary.main',
                        fontWeight: 600,
                        '& .MuiChip-icon': {
                          color: 'primary.main'
                        }
                      }} 
                    />
                    <Typography
                      component="h1"
                      variant="h2"
                      sx={{ 
                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                        color: 'text.primary',
                        mb: 2,
                        fontWeight: 700,
                        letterSpacing: '-0.025em'
                      }}
                    >
                      Smart Fuel Quota
                      <Box component="span" sx={{ color: 'primary.main' }}> Management</Box>
                    </Typography>
                    <Typography 
                      variant="h5" 
                      color="text.secondary" 
                      sx={{ 
                        fontWeight: 400, 
                        lineHeight: 1.6,
                        mb: 4
                      }}
                    >
                      Revolutionary digital system for efficient fuel distribution management during crisis periods. 
                      Secure, transparent, and user-friendly.
                    </Typography>
                  </Box>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button 
                      variant="contained" 
                      component={RouterLink} 
                      to="/login"
                      size="large"
                      endIcon={<ArrowIcon />}
                      sx={{ 
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)'
                      }}
                    >
                      Get Started
                    </Button>
                    <Button 
                      variant="outlined" 
                      component={RouterLink} 
                      to="/register"
                      size="large"
                      sx={{ 
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem'
                      }}
                    >
                      Register Now
                    </Button>
                  </Stack>

                  {/* Quick Stats */}
                  <Box sx={{ pt: 4 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <Box textAlign="center">
                          <Typography variant="h4" color="primary.main" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <TimerIcon sx={{ fontSize: 32, mr: 1 }} />
                            24/7
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            System Uptime
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box textAlign="center">
                          <Typography variant="h4" color="primary.main" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <QrCodeIcon sx={{ fontSize: 32 }} />
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            QR-Based Access
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box textAlign="center">
                          <Typography variant="h4" color="primary.main" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldIcon sx={{ fontSize: 28, mr: 1 }} />
                            100%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Secure Transactions
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper
                  elevation={8}
                  sx={{
                    height: { xs: 300, md: 500 },
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 4
                  }}
                >
                  {/* Background Pattern */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      opacity: 0.1,
                      background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                  />
                  
                  {/* Content */}
                  <Box sx={{ textAlign: 'center', zIndex: 1 }}>
                    <LocalGasStationIcon 
                      sx={{ 
                        fontSize: { xs: 80, md: 120 }, 
                        color: 'white',
                        mb: 3
                      }} 
                    />
                    <Typography variant="h4" color="white" fontWeight="bold" gutterBottom>
                      Fuel Management
                    </Typography>
                    <Typography variant="h6" color="rgba(255,255,255,0.9)" sx={{ mb: 3 }}>
                      Digital • Secure • Efficient
                    </Typography>
                    
                    
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* User Types Section */}
        <Container sx={{ py: 8 }} maxWidth="lg">
          <Box textAlign="center" sx={{ mb: 6 }}>
            <Typography component="h2" variant="h3" color="text.primary" fontWeight="bold" gutterBottom>
              Choose Your Role
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Whether you're a vehicle owner or fuel station operator, our system provides tailored solutions for your needs.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Vehicle Owners */}
            <Grid item xs={12} md={6}>
              <Card 
                elevation={3}
                sx={{ 
                  height: '100%',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 60,
                        height: 60,
                        bgcolor: 'primary.main',
                        color: 'white',
                        borderRadius: 2,
                        mr: 2
                      }}
                    >
                      <CarIcon sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography component="h3" variant="h4" color="text.primary" fontWeight="bold">
                      Vehicle Owners
                    </Typography>
                  </Box>
                  
                  <Typography paragraph color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                    Register your vehicle and get instant access to your fuel quota through our secure QR code system. 
                    Track usage, view transaction history, and manage your fuel allocation efficiently.
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.primary" fontWeight="bold" gutterBottom>
                      Key Features:
                    </Typography>
                    <Stack spacing={1}>
                      {['Unique QR Code Generation', 'Real-time Quota Tracking', 'Transaction History', 'Mobile Dashboard'].map((feature) => (
                        <Box key={feature} sx={{ display: 'flex', alignItems: 'center' }}>
                          <CheckIcon sx={{ color: 'success.main', fontSize: 16, mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </CardContent>
                
                <CardActions sx={{ p: 4, pt: 0 }}>
                  <Button 
                    variant="contained" 
                    component={RouterLink} 
                    to="/login" 
                    fullWidth
                    size="large"
                    endIcon={<ArrowIcon />}
                  >
                    Register Vehicle
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            {/* Fuel Station Owners */}
            <Grid item xs={12} md={6}>
              <Card 
                elevation={3}
                sx={{ 
                  height: '100%',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 60,
                        height: 60,
                        bgcolor: 'success.main',
                        color: 'white',
                        borderRadius: 2,
                        mr: 2
                      }}
                    >
                      <StoreIcon sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography component="h3" variant="h4" color="text.primary" fontWeight="bold">
                      Station Owners
                    </Typography>
                  </Box>
                  
                  <Typography paragraph color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                    Join our network of fuel stations and streamline your operations. Scan vehicle QR codes, 
                    verify quotas instantly, and track all fuel distribution activities in real-time.
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.primary" fontWeight="bold" gutterBottom>
                      Key Features:
                    </Typography>
                    <Stack spacing={1}>
                      {['QR Code Scanner', 'Instant Verification', 'Sales Analytics', 'Transaction Reports'].map((feature) => (
                        <Box key={feature} sx={{ display: 'flex', alignItems: 'center' }}>
                          <CheckIcon sx={{ color: 'success.main', fontSize: 16, mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </CardContent>
                
                <CardActions sx={{ p: 4, pt: 0 }}>
                  <Button 
                    variant="contained" 
                    component={RouterLink} 
                    to="/login" 
                    fullWidth
                    size="large"
                    color="success"
                    endIcon={<ArrowIcon />}
                  >
                    Register Station
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* Features Section */}
        <Box sx={{ bgcolor: alpha('#f5f5f5', 0.5), py: 8 }}>
          <Container maxWidth="lg">
            <Box textAlign="center" sx={{ mb: 6 }}>
              <Typography component="h2" variant="h3" color="text.primary" fontWeight="bold" gutterBottom>
                Why Choose Our System?
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                Built with modern technology and user experience in mind, our platform delivers excellence in every aspect.
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      textAlign: 'center', 
                      p: 3,
                      height: '100%',
                      border: '1px solid',
                      borderColor: alpha('#e0e0e0', 0.3),
                      bgcolor: 'background.paper',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: 3,
                        bgcolor: alpha(feature.color, 0.1),
                        color: feature.color,
                        mb: 2
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Benefits Section */}
        <Container sx={{ py: 8 }} maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography component="h2" variant="h3" color="text.primary" fontWeight="bold" gutterBottom>
                System Benefits
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
                Experience the advantages of a modern, digital approach to fuel quota management.
              </Typography>
              
              <Grid container spacing={2}>
                {benefits.map((benefit, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckIcon sx={{ color: 'success.main', mr: 2 }} />
                      <Typography variant="body1" color="text.primary">
                        {benefit}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={3}
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  bgcolor: alpha('#1976d2', 0.05),
                  border: `1px solid ${alpha('#1976d2', 0.1)}`
                }}
              >
                <Typography variant="h4" color="primary.main" fontWeight="bold" gutterBottom>
                  Ready to Start?
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Join thousands of users who are already benefiting from our efficient fuel management system.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                  <Button 
                    variant="contained" 
                    component={RouterLink} 
                    to="/register"
                    size="large"
                  >
                    Get Started Today
                  </Button>
                  <Button 
                    variant="outlined" 
                    component={RouterLink} 
                    to="/login"
                    size="large"
                  >
                    Sign In
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>

      {/* Enhanced Footer */}
      <Box 
        sx={{ 
          bgcolor: 'grey.900',
          color: 'white',
          py: 6
        }} 
        component="footer"
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalGasStationIcon sx={{ fontSize: 32, mr: 2, color: '#42a5f5' }} />
                <Typography variant="h5" fontWeight="bold">
                  Fuel Quota System
                </Typography>
              </Box>
              <Typography variant="body1" color="grey.300" paragraph>
                Revolutionizing fuel distribution management with cutting-edge technology and user-centric design.
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Links
              </Typography>
              <Stack spacing={1}>
                <Button 
                  component={RouterLink} 
                  to="/login" 
                  sx={{ justifyContent: 'flex-start', color: 'grey.300' }}
                >
                  Login
                </Button>
                <Button 
                  component={RouterLink} 
                  to="/register" 
                  sx={{ justifyContent: 'flex-start', color: 'grey.300' }}
                >
                  Register
                </Button>
              </Stack>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 4, borderColor: 'grey.700' }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="body2" color="grey.400">
              © {new Date().getFullYear()} Fuel Quota Management System. All rights reserved.
            </Typography>
            <Typography variant="body2" color="grey.400">
              Built with excellence for efficient fuel management
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
}