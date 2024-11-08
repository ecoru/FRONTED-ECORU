import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../shared/interfaces/user.interface';

@Component({
  selector: 'admin-users',
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css',
})
export class AdminUsersComponent implements OnInit {
  minDate: string = '2024-01-01';
  maxDate: string = new Date().toISOString().split('T')[0];
  users: User[] = [];
  filteredUsers: User[] = []; // Usuarios filtrados
  selectedType: string = 'TODOS'; // Propiedad para almacenar el tipo seleccionado
  startDate: string = ''; // Fecha de inicio
  endDate: string = ''; // Fecha de fin
  userDelete!: string; //usuario a eliminar
  user: User = {
    primaryKey: '',
    firstName: '',
    lastName: '',
    email: '',
    userType: 'admin',
    documentNumber: '',
    documentType: '',
    phoneNumber: '',
    password: '',
    profilePictureUrl: '',
    createdAt: 0,
    updatedAt: 0
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUser();
  }

  async loadUser(){
      const data =  await this.userService.getUsers();
      this.users = data ?? [];
      this.filteredUsers = this.users; // Inicializa filteredUsers con todos los usuarios
  }

  deleteUser(primaryKey: string) {
    this.userDelete = primaryKey;
  }

  isLoading: boolean = false;
  async confirmDelete() {
    this.isLoading = true;
    const response = await this.userService.deleteUser(this.userDelete);
    if(response  === 'Usuario eliminado correctamente.'){
      this.isLoading = false;
      // Cerrar el modal
      const registerModalElement = document.getElementById('confirmDeleteModal');
      if (registerModalElement) {
        // hacer click en el btn de cerraar modal
        const closeButton = document.getElementById('closeButtonConfir');
        if (closeButton) {
          closeButton.click(); // Simula un clic en el botón de cerrar
        }
      }
      
      this.users = this.users.filter(user => user.primaryKey !== this.userDelete);
      this.filteredUsers = this.filteredUsers.filter(user => user.primaryKey !== this.userDelete);
      this.showCustomAlert(response, 'success');
    }else{
      this.isLoading = false;
      this.showCustomAlert(response, 'error');
    }
    this.isLoading = false;
  }
  

  // Filtro de usuarios por tipo y fechas
  filterUsers() {
    let filtered = this.selectedType === 'TODOS' ? this.users : this.users.filter(user => user.userType === this.selectedType);

    // Filtro de fecha DESDE
    if (this.startDate) {
      const startUnix = new Date(this.startDate).getTime();
      filtered = filtered.filter(user => user.createdAt && user.createdAt >= startUnix); // Verificación de createdAt
    }

    // Filtro de fecha HASTA
    if (this.endDate) {
      const endUnix = new Date(this.endDate).getTime();
      filtered = filtered.filter(user => user.createdAt && user.createdAt <= endUnix); // Verificación de createdAt
    }

    this.filteredUsers = filtered;
  }


  detailUser(data: User){
    this.user = {
      ...data
    };
  }  

  public formatDate(unixTimestamp: number) {
    if(unixTimestamp === 0){
      return `No hay ninguna actulización.`;
    }
    const timestampMs = unixTimestamp.toString().length === 10 ? unixTimestamp * 1000 : unixTimestamp;
    
    // Crea el objeto Date usando el timestamp en milisegundos
    const date = new Date(Number(timestampMs));
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} UTC`;
  }

  // Alerta de error o éxito
  showCustomAlert(message: string, type: 'success' | 'error') {
    const alertDiv = document.createElement('div');
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '50%';
    alertDiv.style.left = '50%';
    alertDiv.style.transform = 'translate(-50%, -50%)';
    alertDiv.style.padding = '20px';
    alertDiv.style.zIndex = '1055';
    alertDiv.style.borderRadius = '5px';
    alertDiv.style.color = '#fff';
    alertDiv.style.fontSize = '16px';
    alertDiv.style.textAlign = 'center';
    alertDiv.style.minWidth = '300px';
    alertDiv.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
    alertDiv.style.backgroundColor = type === 'success' ? '#28a745' : '#dc3545';
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    setTimeout(() => {
      alertDiv.remove();
    }, 1500);
  }
   
}