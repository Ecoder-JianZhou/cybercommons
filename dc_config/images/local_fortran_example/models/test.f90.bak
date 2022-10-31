program main
    implicit none
    !declare all the variables
    integer, parameter  :: n=100
    real, parameter :: Pi = 3.1415927, Period = 1 ![T] = s (1s period) 

    integer :: i, rc, file_unit
    real,dimension(2,n) ::  xs !times and values 
    real :: amplitude, phase , t, x , omega
    character(len=100) :: amplitude_str,phase_str,file_path
    
    !get command line arguments 
    call getarg(1, amplitude_str)     
    call getarg(2, phase_str)    
    call getarg(3, file_path)    

    !convert the some of the strings to reals
    read(amplitude_str,*) amplitude
    read(phase_str,*) phase

    omega = 2*PI/Period

    !compute ts and xs array
        
    do i = 1,n
        t=Period* (i-1)/n 
        x=amplitude*sin(omega*t+phase)
        xs(1,i)=t
        xs(2,i)=x
    end do
        
    !print out results 
    print *, file_path

    !to simulate a longer computation time comparable to TECO take a nap
    call sleep(10)

    !write out results to file as csv
    open(action='write',newunit=file_unit,file=file_path,iostat=rc)
    if (rc /=0) stop 'Error: open failed'
    ! write the header
    write(file_unit,"(A)") "ts,xs"
    ! write the numbers with 9 decimal places
    write (file_unit,'(G0.9,", ",G0.9)') xs
    write(file_unit,"(A)") ""
    close(file_unit)

end program

