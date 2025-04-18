export class HealthCheckController {
  check(req, res) {
    res.status(200).json({
      status: 'ok',
      message: 'Birbnb Api is up'
    });
  }
}