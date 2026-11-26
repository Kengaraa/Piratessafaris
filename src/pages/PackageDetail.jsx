const submit = async e => {
    e.preventDefault()
    if (!user) return nav('/login', { state: { from: `/packages/${slug}` } })
    setBusy(true); setErr('')
    const { error } = await supabase.from('bookings').insert({
      package_id: p.id, travel_date: f.travel_date, adults: Number(f.adults),
      children: Number(f.children), notes: f.notes || null
    })
    if (error) {
      setBusy(false)
      return setErr(error.message)
    }

    try {
      await fetch('https://formsubmit.co/ajax/piratessafaris@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `New Package Booking Request: ${p.title}`,
          _template: 'table',
          Package: p.title,
          Destination: p.destination,
          Customer_Email: user.email || 'Signed-in user',
          Travel_Date: f.travel_date,
          Adults: Number(f.adults),
          Children: Number(f.children),
          Estimated_Total: money(total, p.currency),
          Notes: f.notes || 'None',
        }),
      })
    } catch {
      // Ignore email network errors so the saved booking still completes cleanly
    }

    setBusy(false)
    nav('/account', { state: { booked: true } })
  }